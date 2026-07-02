# GHL Agent Studio Integration

## Architecture decision

Biz-OS supports **two agent runtimes**:

| Layer | Role |
|---|---|
| **Biz-OS** | Brain, governance, source of truth, approvals, reporting |
| **GHL Agent Studio** | CRM-native execution agents |
| **Ask AI** | Operator-facing command interface inside GHL |
| **GHL Workflows** | Event triggers and CRM automation |

1. **Biz-OS Native Agents** (`runtime: biz_os_native`) — internal business
   intelligence, source validation, dashboards, approvals, compliance checks,
   and cross-system reasoning. These are the 10 orchestrated agents in
   `apps/agent-os`.
2. **GHL Agent Studio Agents** (`runtime: ghl_agent_studio`) — CRM-native
   actions, partner intake, Ask AI actions, workflow-triggered actions,
   contact updates, summaries, and GHL-side automation. Built and deployed
   inside GHL Agent Studio, then invoked through Ask AI, GHL Workflows, or
   the Agent Studio Public API. Examples: Sales Partner Qualifier, Partner
   FAQ Agent, simple onboarding assistants.

Biz-OS must not assume all agents run internally. It remains the governance
and reporting layer: it stores canonical source documents, the agent
registry, and agent runs; receives agent results; applies risk checks;
creates approvals and command items; logs audits; and displays agent
performance.

**Governance rule:** all Agent Studio outputs that change pricing, claims,
contracts, public copy, partner status, production workflows, or
compliance-sensitive information must be sent to Biz-OS for approval before
final action.

## Result ingestion endpoint

```
POST /api/ghl/agent-results/sales-partner-qualifier
```

Payload:

```json
{
  "ghl_contact_id": "string",
  "ghl_opportunity_id": "string",
  "agent_name": "Sales Partner Qualifier",
  "fit_score": 85,
  "fit_classification": "high-fit",
  "partner_level_interest": "growth",
  "summary": "Prospect has B2B sales experience, local network, and is ready within 30 days.",
  "risk_flags": [],
  "recommended_next_action": "Send application link and schedule discovery call.",
  "source": "ghl_agent_studio",
  "agent_run_id": "string"
}
```

On receipt Biz-OS:

1. Creates/updates the partner prospect (source attached as **GHL Agent Studio**)
2. Creates an audit log entry
3. Runs the prohibited-claims risk detector over `summary` and
   `recommended_next_action`
4. Creates a command item if follow-up is needed (compliance-risk items score
   higher and require approval)
5. Creates a pending approval when risk flags are present
6. Exposes the result to Partner OS (`GET /api/partners/prospects`) and the
   next action to Command Center (`GET /api/command-items`)

Related read endpoints: `GET /api/approvals`, `GET /api/audit-logs`,
`GET /api/agents/external`. The combined registry (both runtimes) is at
`GET /agents`.

Current implementation: `apps/agent-os/agent_studio.py` (in-memory store,
mirroring the Supabase schema below).

## Supabase schema (target Biz-OS database)

```sql
alter table agents
add column runtime text not null default 'biz_os_native'
check (runtime in ('biz_os_native', 'ghl_agent_studio'));

alter table agents
add column ghl_agent_id text,
add column ghl_location_id text,
add column mapped_to_ask_ai boolean default false,
add column production_status text default 'draft'
check (production_status in ('draft', 'staging', 'production')),
add column last_synced_at timestamptz,
add column allowed_actions jsonb default '[]'::jsonb,
add column requires_approval_for_writes boolean default true;
```

## Agent record fields

| Field | Meaning |
|---|---|
| `runtime` | `biz_os_native` or `ghl_agent_studio` |
| `ghl_agent_id` | Agent Studio agent identifier |
| `ghl_location_id` | GHL location the agent is deployed to |
| `mapped_to_ask_ai` | Whether the agent is exposed through Ask AI |
| `production_status` | `draft` / `staging` / `production` lifecycle |
| `last_synced_at` | Last time a result or sync arrived from GHL |
| `allowed_actions` | Whitelist of actions the agent may trigger |
| `requires_approval_for_writes` | Writes are held for approval by default |
