"""
Lixen OS Agents - Workflow Pipeline
Implements the 10-step agent workflow: Recruit → Enable → Close → Intake → Build → QA → Launch → Scale → Learn → Improve
"""

from enum import Enum
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional
from datetime import datetime
import asyncio


class WorkflowStep(Enum):
    """The 10 steps of the Lixen agent workflow."""
    RECRUIT = 1      # Partner Agent finds and qualifies new partners
    ENABLE = 2       # Sales Agent equips partners to sell and close clients
    CLOSE = 3        # Partner closes and submits client to Intake Agent
    INTAKE = 4       # Collects everything needed for a perfect handoff
    BUILD = 5        # Build Agent deploys and configures the system
    QA = 6           # QA Agent tests, verifies, and clears go-live gates
    LAUNCH = 7       # System goes live, client is trained and launched
    SCALE = 8        # Client Success drives results and retention
    LEARN = 9        # Knowledge Base captures learnings
    IMPROVE = 10     # Analytics Agent measures, reports, and optimizes


@dataclass
class WorkflowStage:
    """A stage in the workflow pipeline."""
    step: WorkflowStep
    agent_type: str
    description: str
    required_gates: List[str] = field(default_factory=list)
    deliverables: List[str] = field(default_factory=list)
    status: str = "pending"  # pending, in_progress, completed, blocked
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None


class WorkflowPipeline:
    """Manages the 10-step Lixen workflow pipeline."""
    
    def __init__(self):
        self.stages: Dict[WorkflowStep, WorkflowStage] = self._initialize_stages()
        self.current_step: Optional[WorkflowStep] = None
        self.workflow_history: List[Dict[str, Any]] = []
        self._handlers: Dict[WorkflowStep, Any] = {}
    
    def _initialize_stages(self) -> Dict[WorkflowStep, WorkflowStage]:
        """Initialize all 10 workflow stages."""
        return {
            WorkflowStep.RECRUIT: WorkflowStage(
                step=WorkflowStep.RECRUIT,
                agent_type="partner_recruitment",
                description="Partner Agent finds and qualifies new partners",
                deliverables=["qualified_partners", "recruitment_pipeline"]
            ),
            WorkflowStep.ENABLE: WorkflowStage(
                step=WorkflowStep.ENABLE,
                agent_type="sales_enablement",
                description="Sales Agent equips partners to sell and close clients",
                deliverables=["demo_scripts", "objection_handling", "pricing_guardrails"]
            ),
            WorkflowStep.CLOSE: WorkflowStage(
                step=WorkflowStep.CLOSE,
                agent_type="partner_recruitment",  # Partner closes the deal
                description="Partner closes and submits client to Intake Agent",
                deliverables=["signed_contract", "payment_received", "client_submitted"]
            ),
            WorkflowStep.INTAKE: WorkflowStage(
                step=WorkflowStep.INTAKE,
                agent_type="client_intake",
                description="Collects everything needed for a perfect handoff",
                required_gates=["intake_complete"],
                deliverables=["intake_forms", "assets_collected", "handoff_summary"]
            ),
            WorkflowStep.BUILD: WorkflowStage(
                step=WorkflowStep.BUILD,
                agent_type="ghl_build",
                description="Build Agent deploys and configures the system",
                required_gates=["build_complete"],
                deliverables=["snapshot_deployed", "workflows_configured", "forms_triggers_set"]
            ),
            WorkflowStep.QA: WorkflowStage(
                step=WorkflowStep.QA,
                agent_type="qa_compliance",
                description="QA Agent tests, verifies, and clears go-live gates",
                required_gates=["qa_30_point_pass", "a2p_10dlc", "consent_review", "ai_disclosure"],
                deliverables=["qa_report", "compliance_checklist", "go_live_approval"]
            ),
            WorkflowStep.LAUNCH: WorkflowStage(
                step=WorkflowStep.LAUNCH,
                agent_type="founder_command",  # System goes live
                description="System goes live, client is trained and launched",
                required_gates=["all_gates_passed"],
                deliverables=["system_live", "client_trained", "training_completed"]
            ),
            WorkflowStep.SCALE: WorkflowStage(
                step=WorkflowStep.SCALE,
                agent_type="client_success",
                description="Client Success drives results and retention",
                deliverables=["kpi_monitoring", "monthly_reports", "optimization_recommendations"]
            ),
            WorkflowStep.LEARN: WorkflowStage(
                step=WorkflowStep.LEARN,
                agent_type="knowledge_base",
                description="Knowledge Base captures learnings",
                deliverables=["sops_updated", "playbooks_created", "training_modules"]
            ),
            WorkflowStep.IMPROVE: WorkflowStage(
                step=WorkflowStep.IMPROVE,
                agent_type="analytics_reporting",
                description="Analytics Agent measures, reports, and optimizes",
                deliverables=["dashboards", "performance_analysis", "executive_summaries", "forecasting"]
            ),
        }
    
    def register_handler(self, step: WorkflowStep, handler) -> None:
        """Register a handler for a workflow step."""
        self._handlers[step] = handler
    
    async def execute_step(self, step: WorkflowStep, context: Dict[str, Any] = None) -> WorkflowStage:
        """Execute a specific workflow step."""
        stage = self.stages[step]
        stage.status = "in_progress"
        stage.started_at = datetime.now()
        self.current_step = step
        
        # Check required gates
        for gate in stage.required_gates:
            if not context.get("gates", {}).get(gate, False):
                stage.status = "blocked"
                return stage
        
        # Execute handler if registered
        handler = self._handlers.get(step)
        if handler:
            try:
                if asyncio.iscoroutinefunction(handler):
                    result = await handler(context or {})
                else:
                    result = handler(context or {})
                stage.result = result
                stage.status = "completed"
            except Exception as e:
                stage.status = "failed"
                stage.result = {"error": str(e)}
        else:
            stage.status = "completed"  # No handler, auto-complete
        
        stage.completed_at = datetime.now()
        self.workflow_history.append({
            "step": step.name,
            "status": stage.status,
            "started_at": stage.started_at.isoformat(),
            "completed_at": stage.completed_at.isoformat() if stage.completed_at else None,
        })
        
        return stage
    
    async def run_full_pipeline(self, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Run the complete 10-step pipeline."""
        context = context or {}
        results = {}
        
        for step in WorkflowStep:
            stage = await self.execute_step(step, context)
            results[step.name] = {
                "status": stage.status,
                "deliverables": stage.deliverables,
                "result": stage.result,
            }
            
            if stage.status == "blocked":
                break
            
            # Update context with results for next step
            context["previous_results"] = context.get("previous_results", {})
            context["previous_results"][step.name] = stage.result
        
        return results
    
    def get_pipeline_status(self) -> Dict[str, Any]:
        """Get current pipeline status."""
        return {
            "current_step": self.current_step.name if self.current_step else None,
            "stages": {
                step.name: {
                    "status": stage.status,
                    "agent_type": stage.agent_type,
                    "required_gates": stage.required_gates,
                    "deliverables": stage.deliverables,
                }
                for step, stage in self.stages.items()
            },
            "history": self.workflow_history,
        }
    
    def get_stage(self, step: WorkflowStep) -> Optional[WorkflowStage]:
        """Get a specific stage."""
        return self.stages.get(step)
    
    def reset_pipeline(self) -> None:
        """Reset all stages."""
        for stage in self.stages.values():
            stage.status = "pending"
            stage.started_at = None
            stage.completed_at = None
            stage.result = None
        self.current_step = None
        self.workflow_history = []
