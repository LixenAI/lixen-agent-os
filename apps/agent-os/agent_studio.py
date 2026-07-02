#!/usr/bin/env python3
"""
GHL Agent Studio Integration — governance layer for externally executed agents.

Biz-OS (this service) is the governance, source-of-truth, approval, analytics,
and orchestration layer. GHL Agent Studio is the execution layer for CRM-native
agents (Sales Partner Qualifier, Partner FAQ Agent, Ask AI mapped agents,
workflow-triggered agents). Agent Studio posts its results here; Biz-OS records
the prospect, writes an audit log, applies risk checks, and creates command
items / approval requests. It never assumes all agents run internally.
"""

from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Any, Dict, List, Literal, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["ghl-agent-studio"])

AgentRuntime = Literal["biz_os_native", "ghl_agent_studio"]
ProductionStatus = Literal["draft", "staging", "production"]


# ─── Risk detection ─────────────────────────────────────────────────
# The Company Playbook and Pricing Guide prohibit guarantees around income,
# revenue, ROI, clients, appointments, or leads. Any Agent Studio output that
# touches these must be held for approval, never auto-applied.

PROHIBITED_CLAIMS = [
    "guaranteed leads",
    "guaranteed appointments",
    "guaranteed income",
    "guaranteed revenue",
    "guaranteed roi",
    "guaranteed clients",
    "ai closes deals",
    "no outreach required",
    "free month",
    "free trial",
]


def detect_risk(text: str) -> List[str]:
    """Return the prohibited claims found in the given text."""
    lower = (text or "").lower()
    return [claim for claim in PROHIBITED_CLAIMS if claim in lower]


# ─── External agent registry ────────────────────────────────────────

@dataclass
class ExternalAgentRecord:
    """A governed agent record. Covers both runtimes: agents executing inside
    Biz-OS and agents built/deployed in GHL Agent Studio and invoked through
    Ask AI, GHL Workflows, or the Agent Studio Public API."""

    name: str
    role_key: str
    runtime: AgentRuntime = "ghl_agent_studio"
    description: str = ""
    enabled: bool = True
    risk_level: str = "normal"
    ghl_agent_id: Optional[str] = None
    ghl_location_id: Optional[str] = None
    mapped_to_ask_ai: bool = False
    production_status: ProductionStatus = "draft"
    last_synced_at: Optional[str] = None
    allowed_actions: List[str] = field(default_factory=list)
    requires_approval_for_writes: bool = True

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


# ─── Governance store ───────────────────────────────────────────────

def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class GovernanceStore:
    """In-memory governance state: external agent registry, partner prospects,
    audit logs, command items, and approvals. Mirrors the future Supabase
    tables (agents, partners, audit_logs, command_items, approvals)."""

    def __init__(self):
        self.external_agents: Dict[str, ExternalAgentRecord] = {}
        self.partner_prospects: Dict[str, Dict[str, Any]] = {}  # by ghl_contact_id
        self.audit_logs: List[Dict[str, Any]] = []
        self.command_items: List[Dict[str, Any]] = []
        self.approvals: List[Dict[str, Any]] = []
        self._counter = 0

    def next_id(self, prefix: str) -> str:
        self._counter += 1
        return f"{prefix}_{self._counter:06d}"

    def register_external_agent(self, record: ExternalAgentRecord) -> None:
        self.external_agents[record.role_key] = record

    def log_audit(
        self,
        actor_type: str,
        actor_id: str,
        action: str,
        entity_type: str,
        entity_id: str,
        after: Dict[str, Any],
        risk_level: str = "normal",
    ) -> Dict[str, Any]:
        entry = {
            "id": self.next_id("audit"),
            "actor_type": actor_type,
            "actor_id": actor_id,
            "action": action,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "after": after,
            "risk_level": risk_level,
            "created_at": _now(),
        }
        self.audit_logs.append(entry)
        return entry

    def create_command_item(
        self,
        title: str,
        description: str,
        command_type: str,
        source_entity_type: str,
        source_entity_id: str,
        priority_score: int,
        requires_approval: bool = False,
        due_at: Optional[str] = None,
    ) -> Dict[str, Any]:
        item = {
            "id": self.next_id("cmd"),
            "title": title,
            "description": description,
            "command_type": command_type,
            "source_entity_type": source_entity_type,
            "source_entity_id": source_entity_id,
            "priority_score": priority_score,
            "status": "open",
            "requires_approval": requires_approval,
            "due_at": due_at,
            "created_at": _now(),
        }
        self.command_items.append(item)
        return item

    def create_approval(self, agent_run_id: str, reason: str) -> Dict[str, Any]:
        approval = {
            "id": self.next_id("appr"),
            "agent_run_id": agent_run_id,
            "status": "pending",
            "reason": reason,
            "created_at": _now(),
            "resolved_at": None,
        }
        self.approvals.append(approval)
        return approval


store = GovernanceStore()

# Seed the CRM-native agents currently deployed in GHL Agent Studio.
store.register_external_agent(ExternalAgentRecord(
    name="Sales Partner Qualifier",
    role_key="sales_partner_qualifier",
    description="Qualifies partner prospects inside GHL and posts fit results to Biz-OS",
    allowed_actions=["post_agent_result"],
))
store.register_external_agent(ExternalAgentRecord(
    name="Partner FAQ Agent",
    role_key="partner_faq",
    description="Answers approved partner-program FAQs inside GHL / Ask AI",
    mapped_to_ask_ai=True,
    allowed_actions=["answer_faq"],
))


# ─── Command priority scoring (mirrors the Biz-OS spec) ─────────────

def score_command_item(
    blocker: bool = False,
    phase_priority: str = "",
    compliance_risk: bool = False,
    payment_related: bool = False,
    overdue: bool = False,
    partner_blocked: bool = False,
    agent_recommended: bool = False,
) -> int:
    score = 0
    if blocker:
        score += 100
    if phase_priority == "critical":
        score += 75
    if compliance_risk:
        score += 60
    if payment_related:
        score += 50
    if overdue:
        score += 40
    if partner_blocked:
        score += 35
    if agent_recommended:
        score += 10
    return score


# ─── Sales Partner Qualifier result endpoint ────────────────────────

class SalesPartnerQualifierResult(BaseModel):
    ghl_contact_id: str
    ghl_opportunity_id: Optional[str] = None
    agent_name: str = "Sales Partner Qualifier"
    fit_score: int
    fit_classification: str
    partner_level_interest: Optional[str] = None
    summary: str = ""
    risk_flags: List[str] = []
    recommended_next_action: Optional[str] = None
    source: str = "ghl_agent_studio"
    agent_run_id: Optional[str] = None


def process_qualifier_result(payload: SalesPartnerQualifierResult) -> Dict[str, Any]:
    """Apply governance to a Sales Partner Qualifier result: upsert the
    prospect, audit-log the run, risk-check the text, and create the
    follow-up command item / approval request."""
    agent = store.external_agents.get("sales_partner_qualifier")
    if agent is None or not agent.enabled:
        raise HTTPException(status_code=403, detail="Sales Partner Qualifier is not an enabled agent")

    detected = detect_risk(f"{payload.summary} {payload.recommended_next_action or ''}")
    risk_flags = list(dict.fromkeys([*payload.risk_flags, *detected]))
    compliance_risk = len(risk_flags) > 0

    # Create/update the partner prospect (Partner OS view)
    prospect = store.partner_prospects.get(payload.ghl_contact_id, {
        "ghl_contact_id": payload.ghl_contact_id,
        "created_at": _now(),
    })
    prospect.update({
        "ghl_opportunity_id": payload.ghl_opportunity_id,
        "fit_score": payload.fit_score,
        "fit_classification": payload.fit_classification,
        "partner_level_interest": payload.partner_level_interest,
        "summary": payload.summary,
        "risk_flags": risk_flags,
        "recommended_next_action": payload.recommended_next_action,
        "source": "GHL Agent Studio",
        "last_agent_run_id": payload.agent_run_id,
        "updated_at": _now(),
    })
    store.partner_prospects[payload.ghl_contact_id] = prospect

    audit = store.log_audit(
        actor_type="agent",
        actor_id=agent.role_key,
        action="agent_result_received",
        entity_type="partner_prospect",
        entity_id=payload.ghl_contact_id,
        after=prospect,
        risk_level="high" if compliance_risk else "normal",
    )

    # Follow-up lands in the Command Center
    command_item = None
    if payload.recommended_next_action or compliance_risk:
        requires_approval = compliance_risk or agent.requires_approval_for_writes
        command_item = store.create_command_item(
            title=f"Partner prospect follow-up: {payload.ghl_contact_id}",
            description=payload.recommended_next_action or "Review flagged agent result",
            command_type="partner_onboarding_task" if not compliance_risk else "compliance_risk",
            source_entity_type="partner_prospect",
            source_entity_id=payload.ghl_contact_id,
            priority_score=score_command_item(
                compliance_risk=compliance_risk,
                partner_blocked=compliance_risk,
                agent_recommended=True,
            ),
            requires_approval=requires_approval,
        )

    approval = None
    if compliance_risk:
        approval = store.create_approval(
            agent_run_id=payload.agent_run_id or audit["id"],
            reason=f"Risk flags on agent result: {', '.join(risk_flags)}",
        )

    agent.last_synced_at = _now()

    return {
        "status": "accepted",
        "prospect": prospect,
        "audit_log_id": audit["id"],
        "command_item": command_item,
        "approval": approval,
        "risk_flags": risk_flags,
    }


@router.post("/api/ghl/agent-results/sales-partner-qualifier")
async def receive_sales_partner_qualifier_result(payload: SalesPartnerQualifierResult):
    """
    Receive a Sales Partner Qualifier result from GHL Agent Studio.

    Example body:
    {
        "ghl_contact_id": "abc123",
        "ghl_opportunity_id": "opp456",
        "agent_name": "Sales Partner Qualifier",
        "fit_score": 85,
        "fit_classification": "high-fit",
        "partner_level_interest": "growth",
        "summary": "Prospect has B2B sales experience and is ready within 30 days.",
        "risk_flags": [],
        "recommended_next_action": "Send application link and schedule discovery call.",
        "source": "ghl_agent_studio",
        "agent_run_id": "run_789"
    }
    """
    return process_qualifier_result(payload)


# ─── Governance read endpoints (Partner OS / Command Center views) ──

@router.get("/api/partners/prospects")
async def list_partner_prospects():
    """Partner OS: prospects created/updated by Agent Studio results."""
    return {"prospects": list(store.partner_prospects.values())}


@router.get("/api/command-items")
async def list_command_items():
    """Command Center: open items sorted by priority score."""
    items = sorted(store.command_items, key=lambda i: i["priority_score"], reverse=True)
    return {"command_items": items}


@router.get("/api/approvals")
async def list_approvals():
    return {"approvals": store.approvals}


@router.get("/api/audit-logs")
async def list_audit_logs():
    return {"audit_logs": store.audit_logs}


@router.get("/api/agents/external")
async def list_external_agents():
    """Registry of GHL Agent Studio agents governed by Biz-OS."""
    return {"agents": [a.to_dict() for a in store.external_agents.values()]}
