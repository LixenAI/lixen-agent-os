"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AgentInfo, SystemSnapshot } from "@/lib/agent-os";
import { DEMO_SNAPSHOT, fetchSnapshot } from "@/lib/agent-os";
import { AgentCard } from "./AgentCard";
import { RunConsole } from "./RunConsole";
import { ApprovalsQueue, AuditTrail, CommandQueue, GatesPanel } from "./OpsPanels";

const POLL_MS = 8000;

function agentKey(agent: AgentInfo): string {
  return agent.agent_id ?? agent.role_key ?? agent.name;
}

export function AgentOsDashboard() {
  const [snapshot, setSnapshot] = useState<SystemSnapshot>(DEMO_SNAPSHOT);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setSnapshot(await fetchSnapshot());
    } catch {
      setSnapshot((prev) => (prev.online ? { ...prev, online: false } : prev));
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, POLL_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  const { native, external } = useMemo(() => {
    return {
      native: snapshot.agents.filter((a) => a.runtime === "biz_os_native"),
      external: snapshot.agents.filter((a) => a.runtime === "ghl_agent_studio"),
    };
  }, [snapshot.agents]);

  const running = native.filter((a) => a.status === "running").length;
  const pendingApprovals = snapshot.approvals.filter((a) => a.status === "pending").length;
  const selected = snapshot.agents.find((a) => agentKey(a) === selectedKey) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Agent OS Manager
        </h2>
        <span
          className={[
            "pill",
            snapshot.online
              ? "border-sky-300 bg-sky-50 text-sky-600"
              : "border-amber-300 bg-amber-50 text-amber-600",
          ].join(" ")}
        >
          {snapshot.online ? "API online" : "offline · demo data"}
        </span>
        <span className="pill border-slate-200 bg-slate-50 text-slate-500">
          {snapshot.agents.length} agents
        </span>
        <span className="pill border-neon-400/40 bg-neon-400/10 text-neon-600">
          {running} running
        </span>
        {pendingApprovals > 0 ? (
          <span className="pill border-amber-300 bg-amber-50 text-amber-600">
            {pendingApprovals} pending approval{pendingApprovals === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <div>
            <h3 className="th px-0">Biz-OS Native · execution inside Biz-OS</h3>
            <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {native.map((agent) => (
                <AgentCard
                  key={agentKey(agent)}
                  agent={agent}
                  selected={agentKey(agent) === selectedKey}
                  onSelect={() =>
                    setSelectedKey(agentKey(agent) === selectedKey ? null : agentKey(agent))
                  }
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="th px-0">GHL Agent Studio · execution inside GHL</h3>
            <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {external.map((agent) => (
                <AgentCard
                  key={agentKey(agent)}
                  agent={agent}
                  selected={agentKey(agent) === selectedKey}
                  onSelect={() =>
                    setSelectedKey(agentKey(agent) === selectedKey ? null : agentKey(agent))
                  }
                />
              ))}
            </div>
          </div>
          {selected ? (
            <RunConsole agent={selected} online={snapshot.online} onRan={refresh} />
          ) : (
            <div className="panel p-4 text-sm text-muted">
              Select an agent to open its run console or external-agent details.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <CommandQueue items={snapshot.commandItems} />
          <ApprovalsQueue approvals={snapshot.approvals} />
          <GatesPanel gates={snapshot.gates} />
        </div>
      </div>

      <AuditTrail logs={snapshot.auditLogs} />
    </div>
  );
}
