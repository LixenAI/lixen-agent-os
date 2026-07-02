"""
Tests for the GHL Agent Studio governance integration.
"""

import unittest

from agent_studio import (
    ExternalAgentRecord,
    GovernanceStore,
    SalesPartnerQualifierResult,
    detect_risk,
    process_qualifier_result,
    score_command_item,
    store,
)


class TestRiskDetection(unittest.TestCase):
    def test_clean_text_has_no_flags(self):
        self.assertEqual(detect_risk("Prospect has B2B sales experience."), [])

    def test_prohibited_claims_are_detected(self):
        flags = detect_risk("We offer GUARANTEED LEADS and guaranteed income.")
        self.assertIn("guaranteed leads", flags)
        self.assertIn("guaranteed income", flags)

    def test_empty_text(self):
        self.assertEqual(detect_risk(""), [])
        self.assertEqual(detect_risk(None), [])


class TestCommandScoring(unittest.TestCase):
    def test_blocker_outranks_recommendation(self):
        self.assertGreater(
            score_command_item(blocker=True),
            score_command_item(agent_recommended=True),
        )

    def test_spec_weights(self):
        score = score_command_item(
            blocker=True,
            phase_priority="critical",
            compliance_risk=True,
            payment_related=True,
            overdue=True,
            partner_blocked=True,
            agent_recommended=True,
        )
        self.assertEqual(score, 100 + 75 + 60 + 50 + 40 + 35 + 10)


class TestGovernanceStore(unittest.TestCase):
    def test_audit_log_entry(self):
        s = GovernanceStore()
        entry = s.log_audit("agent", "sales_partner_qualifier", "agent_result_received",
                            "partner_prospect", "c1", {"fit_score": 85})
        self.assertEqual(len(s.audit_logs), 1)
        self.assertEqual(entry["actor_type"], "agent")
        self.assertEqual(entry["risk_level"], "normal")

    def test_external_agent_defaults(self):
        record = ExternalAgentRecord(name="Test", role_key="test")
        self.assertEqual(record.runtime, "ghl_agent_studio")
        self.assertEqual(record.production_status, "draft")
        self.assertTrue(record.requires_approval_for_writes)
        self.assertFalse(record.mapped_to_ask_ai)
        self.assertIsNone(record.last_synced_at)


class TestQualifierResultEndpoint(unittest.TestCase):
    def setUp(self):
        # Reset shared store state between tests
        store.partner_prospects.clear()
        store.audit_logs.clear()
        store.command_items.clear()
        store.approvals.clear()

    def _payload(self, **overrides):
        base = {
            "ghl_contact_id": "contact_1",
            "ghl_opportunity_id": "opp_1",
            "agent_name": "Sales Partner Qualifier",
            "fit_score": 85,
            "fit_classification": "high-fit",
            "partner_level_interest": "growth",
            "summary": "Prospect has B2B sales experience, local network, and is ready within 30 days.",
            "risk_flags": [],
            "recommended_next_action": "Send application link and schedule discovery call.",
            "source": "ghl_agent_studio",
            "agent_run_id": "run_1",
        }
        base.update(overrides)
        return SalesPartnerQualifierResult(**base)

    def test_clean_result_creates_prospect_audit_and_command_item(self):
        result = process_qualifier_result(self._payload())
        self.assertEqual(result["status"], "accepted")
        self.assertEqual(result["prospect"]["fit_score"], 85)
        self.assertEqual(result["prospect"]["source"], "GHL Agent Studio")
        self.assertEqual(len(store.audit_logs), 1)
        self.assertEqual(len(store.command_items), 1)
        self.assertEqual(store.command_items[0]["command_type"], "partner_onboarding_task")
        self.assertIsNone(result["approval"])

    def test_risky_result_requires_approval(self):
        result = process_qualifier_result(self._payload(
            summary="Tell them we have guaranteed leads and guaranteed roi.",
        ))
        self.assertIn("guaranteed leads", result["risk_flags"])
        self.assertIsNotNone(result["approval"])
        self.assertEqual(result["approval"]["status"], "pending")
        self.assertEqual(store.command_items[0]["command_type"], "compliance_risk")
        self.assertTrue(store.command_items[0]["requires_approval"])
        self.assertEqual(store.audit_logs[0]["risk_level"], "high")

    def test_result_upserts_existing_prospect(self):
        process_qualifier_result(self._payload(fit_score=60, fit_classification="medium-fit"))
        process_qualifier_result(self._payload(fit_score=85))
        self.assertEqual(len(store.partner_prospects), 1)
        self.assertEqual(store.partner_prospects["contact_1"]["fit_score"], 85)

    def test_result_updates_last_synced_at(self):
        agent = store.external_agents["sales_partner_qualifier"]
        agent.last_synced_at = None
        process_qualifier_result(self._payload())
        self.assertIsNotNone(agent.last_synced_at)


if __name__ == "__main__":
    unittest.main()
