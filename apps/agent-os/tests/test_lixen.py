"""
Lixen OS Agents - Test Suite
"""

import asyncio
import unittest
from datetime import datetime

from core.orchestrator import LixenOrchestrator, TaskPriority, AgentStatus
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
from workflows.pipeline import WorkflowPipeline, WorkflowStep
from integrations import IntegrationManager, GoHighLevelIntegration
from gates import GoLiveGateSystem, NorthStarKPIs, GateStatus


class TestAgents(unittest.TestCase):
    """Test all 10 agents."""
    
    def setUp(self):
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
    
    def tearDown(self):
        self.loop.close()
    
    def test_founder_command_agent(self):
        agent = FounderCommandAgent("test_001", "Test Founder")
        self.assertEqual(agent.name, "Test Founder")
        self.assertEqual(len(agent.capabilities), 5)
        
        async def run():
            from core.orchestrator import Task
            task = Task(id="t1", agent_type="founder_command", action="kpi_overview", payload={"kpis": {"test": 1}})
            result = await agent.execute(task)
            self.assertIn("kpis", result)
        
        self.loop.run_until_complete(run())
    
    def test_partner_recruitment_agent(self):
        agent = PartnerRecruitmentAgent("test_002", "Test Partner")
        self.assertEqual(len(agent.capabilities), 5)
    
    def test_all_agents_have_capabilities(self):
        """Verify all 10 agents have capabilities defined."""
        agents = [
            FounderCommandAgent("t1", "T1"),
            PartnerRecruitmentAgent("t2", "T2"),
            SalesEnablementAgent("t3", "T3"),
            ClientIntakeAgent("t4", "T4"),
            GHLBuildAgent("t5", "T5"),
            QAComplianceAgent("t6", "T6"),
            ClientSuccessAgent("t7", "T7"),
            KnowledgeBaseAgent("t8", "T8"),
            MarketingAgent("t9", "T9"),
            AnalyticsReportingAgent("t10", "T10"),
        ]
        for agent in agents:
            self.assertGreater(len(agent.capabilities), 0, f"{agent.name} has no capabilities")


class TestWorkflowPipeline(unittest.TestCase):
    """Test workflow pipeline."""
    
    def test_pipeline_initialization(self):
        pipeline = WorkflowPipeline()
        self.assertEqual(len(pipeline.stages), 10)
    
    def test_pipeline_status(self):
        pipeline = WorkflowPipeline()
        status = pipeline.get_pipeline_status()
        self.assertIn("stages", status)
        self.assertEqual(len(status["stages"]), 10)
    
    def test_stage_retrieval(self):
        pipeline = WorkflowPipeline()
        stage = pipeline.get_stage(WorkflowStep.RECRUIT)
        self.assertIsNotNone(stage)
        self.assertEqual(stage.agent_type, "partner_recruitment")


class TestGoLiveGates(unittest.TestCase):
    """Test go-live gates."""
    
    def test_gate_initialization(self):
        gates = GoLiveGateSystem()
        self.assertEqual(len(gates.gates), 7)
    
    def test_gate_progress(self):
        gates = GoLiveGateSystem()
        gate = gates.get_gate("billing_system")
        self.assertEqual(gate.progress, 0.0)
        
        gates.check_item("billing_system", "Stripe account connected")
        self.assertGreater(gate.progress, 0.0)
    
    def test_can_launch(self):
        gates = GoLiveGateSystem()
        self.assertFalse(gates.can_launch())
    
    def test_get_blocking_gates(self):
        gates = GoLiveGateSystem()
        blocking = gates.get_blocking_gates()
        self.assertEqual(len(blocking), 7)


class TestNorthStarKPIs(unittest.TestCase):
    """Test North Star KPIs."""
    
    def test_kpi_initialization(self):
        kpis = NorthStarKPIs()
        self.assertGreater(len(kpis.kpis), 0)
    
    def test_kpi_update(self):
        kpis = NorthStarKPIs()
        kpis.update_kpi("recruit_partners", 5, "up")
        kpi = kpis.get_kpi("recruit_partners")
        self.assertEqual(kpi.value, 5)
    
    def test_north_star_summary(self):
        kpis = NorthStarKPIs()
        summary = kpis.get_north_star_summary()
        self.assertIn("R1_RECRUIT", summary)
        self.assertIn("R2_REVENUE", summary)
        self.assertIn("R3_RETENTION", summary)
    
    def test_alerts(self):
        kpis = NorthStarKPIs()
        alerts = kpis.get_alerts()
        self.assertGreater(len(alerts), 0)  # All should be off track initially


class TestIntegrations(unittest.TestCase):
    """Test integrations."""
    
    def setUp(self):
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
    
    def tearDown(self):
        self.loop.close()
    
    def test_integration_manager(self):
        manager = IntegrationManager()
        integrations = manager.list_integrations()
        self.assertIn("gohighlevel", integrations)
        self.assertIn("slack", integrations)
        self.assertIn("stripe", integrations)
    
    def test_ghl_integration(self):
        ghl = GoHighLevelIntegration({"api_key": "test", "location_id": "loc123"})
        self.assertEqual(ghl.location_id, "loc123")
        
        async def run():
            connected = await ghl.connect()
            self.assertTrue(connected)
        
        self.loop.run_until_complete(run())


class TestOrchestrator(unittest.TestCase):
    """Test orchestrator."""
    
    def setUp(self):
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
    
    def tearDown(self):
        self.loop.close()
    
    def test_orchestrator_initialization(self):
        orch = LixenOrchestrator()
        self.assertFalse(orch.running)
    
    def test_task_id_generation(self):
        orch = LixenOrchestrator()
        id1 = orch.generate_task_id()
        id2 = orch.generate_task_id()
        self.assertNotEqual(id1, id2)
    
    def test_gate_management(self):
        orch = LixenOrchestrator()
        orch.set_gate("test_gate", True)
        self.assertTrue(orch.check_gate("test_gate"))
        self.assertFalse(orch.check_gate("nonexistent"))


if __name__ == "__main__":
    unittest.main()
