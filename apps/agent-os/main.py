#!/usr/bin/env python3
"""
Lixen OS Agents - Main Entry Point

AI Agent Operating System for service-based local businesses.
"""

import asyncio
import json
import sys
from datetime import datetime
from typing import Any, Dict

from core.orchestrator import LixenOrchestrator, TaskPriority
from workflows.pipeline import WorkflowPipeline, WorkflowStep
from integrations import IntegrationManager
from config.settings import load_config


class LixenOS:
    """Main Lixen OS Agent System."""
    
    def __init__(self, config_path: str = None):
        self.config = load_config(config_path)
        self.orchestrator = LixenOrchestrator(self.config)
        self.workflow = WorkflowPipeline()
        self.integrations = IntegrationManager()
        self._register_agents()
        self._setup_workflow_handlers()
    
    def _register_agents(self) -> None:
        """Register all 10 Lixen agents with the orchestrator."""
        from agents import (
            FounderCommandAgent,
            PartnerRecruitmentAgent,
            SalesEnablementAgent,
            ClientIntakeAgent,
            GHLBuildAgent,
            QAComplianceAgent,
            ClientSuccessAgent,
            KnowledgeBaseAgent,
            MarketingAgent,
            AnalyticsReportingAgent,
        )
        
        registry = self.orchestrator.registry
        
        # Register agent types
        registry.register_agent_type("founder_command", FounderCommandAgent)
        registry.register_agent_type("partner_recruitment", PartnerRecruitmentAgent)
        registry.register_agent_type("sales_enablement", SalesEnablementAgent)
        registry.register_agent_type("client_intake", ClientIntakeAgent)
        registry.register_agent_type("ghl_build", GHLBuildAgent)
        registry.register_agent_type("qa_compliance", QAComplianceAgent)
        registry.register_agent_type("client_success", ClientSuccessAgent)
        registry.register_agent_type("knowledge_base", KnowledgeBaseAgent)
        registry.register_agent_type("marketing", MarketingAgent)
        registry.register_agent_type("analytics_reporting", AnalyticsReportingAgent)
        
        # Create instances
        registry.create_agent("founder_command", "founder_command_001", "Founder Command Agent", self.config)
        registry.create_agent("partner_recruitment", "partner_recruitment_001", "Partner Recruitment Agent", self.config)
        registry.create_agent("sales_enablement", "sales_enablement_001", "Sales Enablement Agent", self.config)
        registry.create_agent("client_intake", "client_intake_001", "Client Intake Agent", self.config)
        registry.create_agent("ghl_build", "ghl_build_001", "GHL Build Agent", self.config)
        registry.create_agent("qa_compliance", "qa_compliance_001", "QA + Compliance Agent", self.config)
        registry.create_agent("client_success", "client_success_001", "Client Success Agent", self.config)
        registry.create_agent("knowledge_base", "knowledge_base_001", "Knowledge Base Agent", self.config)
        registry.create_agent("marketing", "marketing_001", "Marketing Agent", self.config)
        registry.create_agent("analytics_reporting", "analytics_reporting_001", "Analytics & Reporting Agent", self.config)
        
        print("[Lixen OS] All 10 agents registered successfully")
    
    def _setup_workflow_handlers(self) -> None:
        """Setup handlers for each workflow step."""
        # The workflow will use agents directly for execution
        async def handle_recruit(ctx):
            agent = self.orchestrator.registry.get_agent("partner_recruitment_001")
            task = await self.orchestrator.submit_task(
                "partner_recruitment", "linkedin_outreach",
                payload=ctx.get("recruit", {})
            )
            return {"result": task.result}
        
        async def handle_enable(ctx):
            agent = self.orchestrator.registry.get_agent("sales_enablement_001")
            task = await self.orchestrator.submit_task(
                "sales_enablement", "demo_scripts",
                payload=ctx.get("enable", {})
            )
            return {"result": task.result}
        
        async def handle_close(ctx):
            agent = self.orchestrator.registry.get_agent("partner_recruitment_001")
            task = await self.orchestrator.submit_task(
                "partner_recruitment", "pipeline_management",
                payload=ctx.get("close", {})
            )
            return {"result": task.result}
        
        async def handle_intake(ctx):
            agent = self.orchestrator.registry.get_agent("client_intake_001")
            task = await self.orchestrator.submit_task(
                "client_intake", "intake_forms",
                payload=ctx.get("intake", {})
            )
            return {"result": task.result}
        
        async def handle_build(ctx):
            agent = self.orchestrator.registry.get_agent("ghl_build_001")
            task = await self.orchestrator.submit_task(
                "ghl_build", "snapshot_deployment",
                payload=ctx.get("build", {})
            )
            return {"result": task.result}
        
        async def handle_qa(ctx):
            agent = self.orchestrator.registry.get_agent("qa_compliance_001")
            task = await self.orchestrator.submit_task(
                "qa_compliance", "qa_execution",
                payload=ctx.get("qa", {})
            )
            return {"result": task.result}
        
        async def handle_launch(ctx):
            agent = self.orchestrator.registry.get_agent("founder_command_001")
            task = await self.orchestrator.submit_task(
                "founder_command", "track_launch_readiness",
                payload=ctx.get("launch", {})
            )
            return {"result": task.result}
        
        async def handle_scale(ctx):
            agent = self.orchestrator.registry.get_agent("client_success_001")
            task = await self.orchestrator.submit_task(
                "client_success", "kpi_monitoring",
                payload=ctx.get("scale", {})
            )
            return {"result": task.result}
        
        async def handle_learn(ctx):
            agent = self.orchestrator.registry.get_agent("knowledge_base_001")
            task = await self.orchestrator.submit_task(
                "knowledge_base", "sop_creation",
                payload=ctx.get("learn", {})
            )
            return {"result": task.result}
        
        async def handle_improve(ctx):
            agent = self.orchestrator.registry.get_agent("analytics_reporting_001")
            task = await self.orchestrator.submit_task(
                "analytics_reporting", "dashboard_generation",
                payload=ctx.get("improve", {})
            )
            return {"result": task.result}
        
        self.workflow.register_handler(WorkflowStep.RECRUIT, handle_recruit)
        self.workflow.register_handler(WorkflowStep.ENABLE, handle_enable)
        self.workflow.register_handler(WorkflowStep.CLOSE, handle_close)
        self.workflow.register_handler(WorkflowStep.INTAKE, handle_intake)
        self.workflow.register_handler(WorkflowStep.BUILD, handle_build)
        self.workflow.register_handler(WorkflowStep.QA, handle_qa)
        self.workflow.register_handler(WorkflowStep.LAUNCH, handle_launch)
        self.workflow.register_handler(WorkflowStep.SCALE, handle_scale)
        self.workflow.register_handler(WorkflowStep.LEARN, handle_learn)
        self.workflow.register_handler(WorkflowStep.IMPROVE, handle_improve)
    
    async def initialize(self) -> None:
        """Initialize the Lixen OS system."""
        print("[Lixen OS] Initializing...")
        await self.orchestrator.start()
        
        # Connect integrations
        connect_results = await self.integrations.connect_all()
        print(f"[Lixen OS] Integration connections: {connect_results}")
        
        # Set default go-live gates
        self.orchestrator.set_gate("billing_system_configured", False)
        self.orchestrator.set_gate("a2p_10dlc_verified", False)
        self.orchestrator.set_gate("demo_workflows_built", False)
        self.orchestrator.set_gate("blank_account_deployed", False)
        self.orchestrator.set_gate("qa_30_point_passed", False)
        self.orchestrator.set_gate("missed_call_text_set", False)
        self.orchestrator.set_gate("client_signoff_approved", False)
        
        print("[Lixen OS] Initialization complete")
    
    async def run_workflow(self, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Run the full 10-step workflow."""
        print("[Lixen OS] Running workflow pipeline...")
        results = await self.workflow.run_full_pipeline(context)
        return results
    
    async def execute_agent_task(self, agent_type: str, action: str, payload: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute a specific agent task."""
        task = await self.orchestrator.submit_task(agent_type, action, payload=payload)
        # Process the task immediately
        agent = self.orchestrator.registry.get_agent(f"{agent_type}_001")
        if agent:
            await agent.process_task(task)
        return task.to_dict()
    
    async def get_system_status(self) -> Dict[str, Any]:
        """Get full system status."""
        return {
            "orchestrator": self.orchestrator.get_system_status(),
            "workflow": self.workflow.get_pipeline_status(),
            "integrations": self.integrations.list_integrations(),
            "timestamp": datetime.now().isoformat(),
        }
    
    async def shutdown(self) -> None:
        """Shutdown the Lixen OS system."""
        print("[Lixen OS] Shutting down...")
        await self.integrations.disconnect_all()
        await self.orchestrator.stop()
        print("[Lixen OS] Shutdown complete")


async def main():
    """Main entry point."""
    print("=" * 60)
    print("LIXEN OS - AI Agent Operating System")
    print("You close. We build, deploy, and deliver.")
    print("=" * 60)
    
    # Initialize system
    lixen = LixenOS()
    await lixen.initialize()
    
    # Example: Run a sample task
    print("\n[Example] Running a Founder Command task...")
    result = await lixen.execute_agent_task(
        "founder_command", "kpi_overview",
        payload={"kpis": {"recruit": 5, "revenue": 10000, "retention": 0.95}}
    )
    print(f"Result: {json.dumps(result, indent=2, default=str)}")
    
    # Example: Run workflow
    print("\n[Example] Running workflow pipeline...")
    workflow_results = await lixen.run_workflow()
    print(f"Workflow Results: {json.dumps(workflow_results, indent=2, default=str)}")
    
    # Get system status
    print("\n[System Status]")
    status = await lixen.get_system_status()
    print(json.dumps(status, indent=2, default=str))
    
    # Shutdown
    await lixen.shutdown()


if __name__ == "__main__":
    asyncio.run(main())
