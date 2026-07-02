"use client";

import { useState } from "react";
import type { AgentInfo, TaskRunResult } from "@/lib/agent-os";
import { runAgentTask } from "@/lib/agent-os";

// Only Biz-OS native agents are runnable from here. GHL Agent Studio agents
// execute inside GHL (Ask AI / Workflows / Public API) and report back
// through the agent-results webhook.
export function RunConsole({
  agent,
  online,
  onRan,
}: {
  agent: AgentInfo;
  online: boolean;
  onRan: () => void;
}) {
  const native = agent.runtime === "biz_os_native";
  const [action, setAction] = useState(agent.capabilities?.[0] ?? "");
  const [payload, setPayload] = useState("{}");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<TaskRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!native) {
    return (
      <div className="panel p-4">
        <h3 className="th px-0">External Agent — {agent.name}</h3>
        <p className="mt-1 text-sm text-muted">
          Runs inside GHL Agent Studio and reports results to Biz-OS through{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">
            /api/ghl/agent-results/*
          </code>
          . Results appear in the queues on the right and in the audit trail.
        </p>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted">
          <dt>GHL agent ID</dt>
          <dd className="text-ink">{agent.ghl_agent_id ?? "—"}</dd>
          <dt>Location</dt>
          <dd className="text-ink">{agent.ghl_location_id ?? "—"}</dd>
          <dt>Last synced</dt>
          <dd className="text-ink">{agent.last_synced_at ?? "never"}</dd>
        </dl>
      </div>
    );
  }

  const agentType = (agent.agent_id ?? "").replace(/_\d+$/, "");

  const run = async () => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const parsed = payload.trim() ? JSON.parse(payload) : {};
      const res = await runAgentTask(agentType, action, parsed);
      setResult(res);
      onRan();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="panel p-4">
      <h3 className="th px-0">Run Console — {agent.name}</h3>
      <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-start">
        <label className="flex flex-col gap-1 text-2xs uppercase tracking-wide text-muted">
          Action
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="rounded-md border border-hairline bg-white px-2 py-1.5 text-sm text-ink"
          >
            {(agent.capabilities ?? []).map((cap) => (
              <option key={cap} value={cap}>
                {cap}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1 text-2xs uppercase tracking-wide text-muted">
          Payload (JSON)
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={2}
            spellCheck={false}
            className="rounded-md border border-hairline bg-white px-2 py-1.5 font-mono text-xs text-ink"
          />
        </label>
        <button
          type="button"
          onClick={run}
          disabled={running || !online || !action}
          className="mt-4 rounded-md border border-neon-400/40 bg-neon-400/10 px-4 py-1.5 text-sm font-semibold text-neon-600 shadow-neon transition-opacity disabled:opacity-40"
        >
          {running ? "Running…" : "Run"}
        </button>
      </div>
      {!online ? (
        <p className="mt-2 text-xs text-amber-600">
          Agent OS API offline — start it with <code>npm run dev:agent</code> to run tasks.
        </p>
      ) : null}
      {error ? <p className="mt-2 text-xs text-rose-500">{error}</p> : null}
      {result ? (
        <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-slate-50 p-3 text-2xs text-slate-700">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
