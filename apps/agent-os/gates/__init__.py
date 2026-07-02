"""
Lixen OS Agents - Go-Live Gates & KPI System

Implements the critical quality gates and North Star KPIs (R³: Recruit · Revenue · Retention)
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional
from enum import Enum


class GateStatus(Enum):
    """Status of a go-live gate."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    PASSED = "passed"
    FAILED = "failed"
    BLOCKED = "blocked"


@dataclass
class GoLiveGate:
    """A go-live gate that must be completed before launch."""
    id: str
    name: str
    description: str
    status: GateStatus = GateStatus.PENDING
    required: bool = True
    checklist: List[str] = field(default_factory=list)
    completed_items: List[str] = field(default_factory=list)
    assigned_to: str = ""
    due_date: Optional[str] = None
    completed_at: Optional[datetime] = None
    notes: str = ""
    
    @property
    def progress(self) -> float:
        """Calculate progress percentage."""
        if not self.checklist:
            return 0.0
        return len(self.completed_items) / len(self.checklist)
    
    @property
    def is_complete(self) -> bool:
        """Check if all checklist items are complete."""
        return len(self.completed_items) == len(self.checklist) and len(self.checklist) > 0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "status": self.status.value,
            "required": self.required,
            "checklist": self.checklist,
            "completed_items": self.completed_items,
            "progress": self.progress,
            "is_complete": self.is_complete,
            "assigned_to": self.assigned_to,
            "due_date": self.due_date,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "notes": self.notes,
        }


class GoLiveGateSystem:
    """Manages all go-live gates for the Lixen OS."""
    
    def __init__(self):
        self.gates: Dict[str, GoLiveGate] = {}
        self._initialize_default_gates()
    
    def _initialize_default_gates(self) -> None:
        """Initialize all default go-live gates from the blueprint."""
        gates_data = [
            {
                "id": "billing_system",
                "name": "Billing System Configured and Tested",
                "description": "Stripe billing system is properly configured and tested",
                "checklist": [
                    "Stripe account connected",
                    "Payment methods configured",
                    "Invoicing templates set up",
                    "Test transactions completed",
                    "Webhook endpoints configured"
                ],
                "assigned_to": "ghl_build_agent",
            },
            {
                "id": "a2p_10dlc",
                "name": "A2P / 10DLC Verification Complete",
                "description": "A2P 10DLC registration completed for SMS compliance",
                "checklist": [
                    "A2P registration submitted",
                    "10DLC numbers registered",
                    "Brand verification completed",
                    "Campaign approval received",
                    "Opt-out mechanisms tested"
                ],
                "assigned_to": "qa_compliance_agent",
            },
            {
                "id": "demo_workflows",
                "name": "5 Core Demo Workflows Built and Tested",
                "description": "All 5 core demo workflows are built and fully tested",
                "checklist": [
                    "Lead capture workflow",
                    "Appointment booking workflow",
                    "Follow-up sequence workflow",
                    "Missed call text workflow",
                    "Review request workflow",
                    "End-to-end testing complete"
                ],
                "assigned_to": "ghl_build_agent",
            },
            {
                "id": "blank_account_deploy",
                "name": "Blank Account Deployment Test Passed",
                "description": "Blank account deployment test completed successfully",
                "checklist": [
                    "Snapshot deployed to test account",
                    "All configurations verified",
                    "Data integrity checked",
                    "Performance test passed"
                ],
                "assigned_to": "ghl_build_agent",
            },
            {
                "id": "qa_30_point",
                "name": "30-Point QA Fully Passed",
                "description": "Complete 30-point QA checklist passed",
                "checklist": [
                    "Forms functioning correctly",
                    "Triggers firing properly",
                    "Pipelines configured correctly",
                    "Calendar integration working",
                    "SMS deliverability verified",
                    "Email deliverability verified",
                    "Landing pages loading correctly",
                    "Tracking pixels installed",
                    "GDPR compliance checked",
                    "Accessibility checked",
                    "Mobile responsiveness verified",
                    "Browser compatibility tested",
                    "Load time under 3 seconds",
                    "SSL certificate active",
                    "Domain DNS configured",
                    "Contact sync working",
                    "Opportunity stages correct",
                    "Automation sequences tested",
                    "Custom fields populated",
                    "Tags and segments correct",
                    "Reporting dashboards configured",
                    "User permissions set",
                    "Integration connections verified",
                    "Backup system configured",
                    "Error logging active",
                    "Rate limiting configured",
                    "Spam protection active",
                    "Two-factor auth enabled",
                    "API keys secured",
                    "Documentation complete"
                ],
                "assigned_to": "qa_compliance_agent",
            },
            {
                "id": "missed_call_text",
                "name": "Missed-Call Text Copy Set",
                "description": "Missed call text message templates configured",
                "checklist": [
                    "Missed call text template created",
                    "Personalization tokens working",
                    "Timing rules configured",
                    "Fallback messages set",
                    "Compliance review passed"
                ],
                "assigned_to": "ghl_build_agent",
            },
            {
                "id": "client_signoff",
                "name": "Client Sign-Off and Approval",
                "description": "Client has reviewed and approved the system",
                "checklist": [
                    "Client walkthrough completed",
                    "Training session delivered",
                    "Client feedback incorporated",
                    "Signed approval received",
                    "Go-live date confirmed"
                ],
                "assigned_to": "client_success_agent",
            },
        ]
        
        for gate_data in gates_data:
            gate = GoLiveGate(**gate_data)
            self.gates[gate.id] = gate
    
    def get_gate(self, gate_id: str) -> Optional[GoLiveGate]:
        """Get a gate by ID."""
        return self.gates.get(gate_id)
    
    def check_item(self, gate_id: str, item: str) -> bool:
        """Mark a checklist item as complete."""
        gate = self.gates.get(gate_id)
        if not gate:
            return False
        if item in gate.checklist and item not in gate.completed_items:
            gate.completed_items.append(item)
            if gate.is_complete:
                gate.status = GateStatus.PASSED
                gate.completed_at = datetime.now()
            elif gate.progress > 0:
                gate.status = GateStatus.IN_PROGRESS
            return True
        return False
    
    def uncheck_item(self, gate_id: str, item: str) -> bool:
        """Mark a checklist item as incomplete."""
        gate = self.gates.get(gate_id)
        if not gate:
            return False
        if item in gate.completed_items:
            gate.completed_items.remove(item)
            if not gate.completed_items:
                gate.status = GateStatus.PENDING
            else:
                gate.status = GateStatus.IN_PROGRESS
            return True
        return False
    
    def get_all_gates_status(self) -> Dict[str, Any]:
        """Get status of all gates."""
        total = len(self.gates)
        passed = sum(1 for g in self.gates.values() if g.status == GateStatus.PASSED)
        required = sum(1 for g in self.gates.values() if g.required)
        required_passed = sum(1 for g in self.gates.values() if g.required and g.status == GateStatus.PASSED)
        
        return {
            "total_gates": total,
            "passed": passed,
            "required": required,
            "required_passed": required_passed,
            "all_required_passed": required_passed == required,
            "overall_progress": sum(g.progress for g in self.gates.values()) / total if total > 0 else 0,
            "gates": {gate_id: gate.to_dict() for gate_id, gate in self.gates.items()},
        }
    
    def can_launch(self) -> bool:
        """Check if all required gates are passed (system is ready to launch)."""
        return all(
            gate.status == GateStatus.PASSED for gate in self.gates.values() if gate.required
        )
    
    def get_blocking_gates(self) -> List[Dict[str, Any]]:
        """Get list of gates blocking launch."""
        return [
            gate.to_dict()
            for gate in self.gates.values()
            if gate.required and gate.status != GateStatus.PASSED
        ]


@dataclass
class KPI:
    """A Key Performance Indicator."""
    name: str
    value: float
    target: float
    unit: str = ""
    period: str = "monthly"
    trend: str = "flat"  # up, down, flat
    previous_value: float = 0.0
    
    @property
    def progress(self) -> float:
        """Calculate progress toward target."""
        if self.target == 0:
            return 0.0
        return min(self.value / self.target, 1.0)
    
    @property
    def is_on_track(self) -> bool:
        """Check if KPI is on track."""
        return self.value >= self.target
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "value": self.value,
            "target": self.target,
            "unit": self.unit,
            "period": self.period,
            "trend": self.trend,
            "previous_value": self.previous_value,
            "progress": self.progress,
            "on_track": self.is_on_track,
        }


class NorthStarKPIs:
    """
    North Star KPIs: R³ - Recruit · Revenue · Retention
    """
    
    def __init__(self):
        self.kpis: Dict[str, KPI] = {}
        self._initialize_default_kpis()
    
    def _initialize_default_kpis(self) -> None:
        """Initialize North Star KPIs."""
        self.kpis = {
            "recruit_partners": KPI(
                name="Partners Recruited",
                value=0,
                target=10,
                unit="partners",
                period="monthly",
            ),
            "recruit_quality_score": KPI(
                name="Partner Quality Score",
                value=0,
                target=85,
                unit="score",
                period="monthly",
            ),
            "revenue_new": KPI(
                name="New Revenue",
                value=0,
                target=50000,
                unit="USD",
                period="monthly",
            ),
            "revenue_per_partner": KPI(
                name="Revenue Per Partner",
                value=0,
                target=5000,
                unit="USD",
                period="monthly",
            ),
            "retention_rate": KPI(
                name="Client Retention Rate",
                value=0,
                target=0.90,
                unit="percentage",
                period="monthly",
            ),
            "retention_churn_rate": KPI(
                name="Churn Rate",
                value=0,
                target=0.10,
                unit="percentage",
                period="monthly",
            ),
            "client_nps": KPI(
                name="Client NPS",
                value=0,
                target=50,
                unit="score",
                period="quarterly",
            ),
            "system_uptime": KPI(
                name="System Uptime",
                value=0.99,
                target=0.995,
                unit="percentage",
                period="monthly",
            ),
        }
    
    def update_kpi(self, name: str, value: float, trend: str = "flat") -> None:
        """Update a KPI value."""
        if name in self.kpis:
            kpi = self.kpis[name]
            kpi.previous_value = kpi.value
            kpi.value = value
            kpi.trend = trend
    
    def get_kpi(self, name: str) -> Optional[KPI]:
        """Get a specific KPI."""
        return self.kpis.get(name)
    
    def get_all_kpis(self) -> Dict[str, Dict[str, Any]]:
        """Get all KPIs."""
        return {name: kpi.to_dict() for name, kpi in self.kpis.items()}
    
    def get_north_star_summary(self) -> Dict[str, Any]:
        """Get the North Star R³ summary."""
        recruit_kpis = ["recruit_partners", "recruit_quality_score"]
        revenue_kpis = ["revenue_new", "revenue_per_partner"]
        retention_kpis = ["retention_rate", "retention_churn_rate", "client_nps"]
        
        def avg_progress(kpi_list):
            values = [self.kpis[k].progress for k in kpi_list if k in self.kpis]
            return sum(values) / len(values) if values else 0
        
        return {
            "R1_RECRUIT": {
                "progress": avg_progress(recruit_kpis),
                "kpis": {k: self.kpis[k].to_dict() for k in recruit_kpis if k in self.kpis},
            },
            "R2_REVENUE": {
                "progress": avg_progress(revenue_kpis),
                "kpis": {k: self.kpis[k].to_dict() for k in revenue_kpis if k in self.kpis},
            },
            "R3_RETENTION": {
                "progress": avg_progress(retention_kpis),
                "kpis": {k: self.kpis[k].to_dict() for k in retention_kpis if k in self.kpis},
            },
            "overall_health": avg_progress(list(self.kpis.keys())),
        }
    
    def get_alerts(self) -> List[Dict[str, Any]]:
        """Get KPIs that are off track."""
        alerts = []
        for name, kpi in self.kpis.items():
            if not kpi.is_on_track:
                alerts.append({
                    "kpi": name,
                    "current_value": kpi.value,
                    "target": kpi.target,
                    "gap": kpi.target - kpi.value,
                    "severity": "critical" if kpi.progress < 0.5 else "warning",
                })
        return alerts
