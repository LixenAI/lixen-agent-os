// Client for the Agent OS (FastAPI) governance API. All calls go through the
// browser so the dashboard reflects live agent state; when the API is
// unreachable the UI falls back to demo data and shows an offline pill.

export const AGENT_OS_URL =
  process.env.NEXT_PUBLIC_AGENT_OS_URL || "http://localhost:8000";

export type AgentRuntime = "biz_os_native" | "ghl_agent_studio";

export interface AgentInfo {
  // Native agents (orchestrator status shape)
  agent_id?: string;
  name: string;
  status?: string;
  metrics?: {
    tasks_completed: number;
    tasks_failed: number;
    avg_execution_time: number;
  };
  capabilities?: string[];
  runtime: AgentRuntime;
  // GHL Agent Studio agents (registry shape)
  role_key?: string;
  description?: string;
  enabled?: boolean;
  ghl_agent_id?: string | null;
  ghl_location_id?: string | null;
  mapped_to_ask_ai?: boolean;
  production_status?: "draft" | "staging" | "production";
  last_synced_at?: string | null;
  requires_approval_for_writes?: boolean;
}

export interface CommandItem {
  id: string;
  title: string;
  description: string;
  command_type: string;
  priority_score: number;
  status: string;
  requires_approval: boolean;
  created_at: string;
}

export interface Approval {
  id: string;
  agent_run_id: string;
  status: string;
  reason: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_type: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  risk_level: string;
  created_at: string;
}

export interface SystemSnapshot {
  online: boolean;
  agents: AgentInfo[];
  gates: Record<string, boolean>;
  commandItems: CommandItem[];
  approvals: Approval[];
  auditLogs: AuditLog[];
}

export interface TaskRunResult {
  id: string;
  agent_type: string;
  action: string;
  status: string;
  result: Record<string, unknown> | null;
  error: string | null;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${AGENT_OS_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
}

export async function fetchSnapshot(): Promise<SystemSnapshot> {
  const [agents, gates, commands, approvals, audits] = await Promise.all([
    getJson<{ agents: AgentInfo[] }>("/agents"),
    getJson<{ gates: Record<string, boolean> }>("/gates"),
    getJson<{ command_items: CommandItem[] }>("/api/command-items"),
    getJson<{ approvals: Approval[] }>("/api/approvals"),
    getJson<{ audit_logs: AuditLog[] }>("/api/audit-logs"),
  ]);
  return {
    online: true,
    agents: agents.agents,
    gates: gates.gates,
    commandItems: commands.command_items,
    approvals: approvals.approvals,
    auditLogs: audits.audit_logs.slice().reverse(),
  };
}

export async function runAgentTask(
  agentType: string,
  action: string,
  payload: Record<string, unknown>,
): Promise<TaskRunResult> {
  const res = await fetch(`${AGENT_OS_URL}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent_type: agentType, action, payload }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Task failed (${res.status}): ${detail}`);
  }
  return res.json();
}

// ─── Demo fallback (API offline) ────────────────────────────────────

const NATIVE_DEMO: Array<[string, string, string[]]> = [
  ["founder_command", "Founder Command Agent", ["kpi_overview", "track_launch_readiness"]],
  ["partner_recruitment", "Partner Recruitment Agent", ["linkedin_outreach", "pipeline_management"]],
  ["sales_enablement", "Sales Enablement Agent", ["demo_scripts", "pricing_explanations"]],
  ["client_intake", "Client Intake Agent", ["intake_forms", "inquiry_routing"]],
  ["ghl_build", "GHL Build Agent", ["snapshot_deployment", "workflow_builds"]],
  ["qa_compliance", "QA + Compliance Agent", ["qa_execution", "claims_check"]],
  ["client_success", "Client Success Agent", ["kpi_monitoring", "support_summaries"]],
  ["knowledge_base", "Knowledge Base Agent", ["sop_creation", "stale_content_alerts"]],
  ["marketing", "Marketing Agent", ["compliant_content", "campaign_drafts"]],
  ["analytics_reporting", "Analytics & Reporting Agent", ["dashboard_generation", "weekly_summary"]],
];

export const DEMO_SNAPSHOT: SystemSnapshot = {
  online: false,
  agents: [
    ...NATIVE_DEMO.map(([key, name, capabilities]) => ({
      agent_id: `${key}_001`,
      name,
      status: "idle",
      metrics: { tasks_completed: 0, tasks_failed: 0, avg_execution_time: 0 },
      capabilities,
      runtime: "biz_os_native" as const,
    })),
    {
      name: "Sales Partner Qualifier",
      role_key: "sales_partner_qualifier",
      description: "Qualifies partner prospects inside GHL and posts fit results to Biz-OS",
      runtime: "ghl_agent_studio" as const,
      enabled: true,
      production_status: "draft" as const,
      mapped_to_ask_ai: false,
      requires_approval_for_writes: true,
      last_synced_at: null,
    },
    {
      name: "Partner FAQ Agent",
      role_key: "partner_faq",
      description: "Answers approved partner-program FAQs inside GHL / Ask AI",
      runtime: "ghl_agent_studio" as const,
      enabled: true,
      production_status: "draft" as const,
      mapped_to_ask_ai: true,
      requires_approval_for_writes: true,
      last_synced_at: null,
    },
  ],
  gates: {
    billing_system_configured: false,
    a2p_10dlc_verified: false,
    demo_workflows_built: false,
    blank_account_deployed: false,
    qa_30_point_passed: false,
    missed_call_text_set: false,
    client_signoff_approved: false,
  },
  commandItems: [],
  approvals: [],
  auditLogs: [],
};
