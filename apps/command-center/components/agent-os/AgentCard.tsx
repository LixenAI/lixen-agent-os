"use client";

import type { AgentInfo } from "@/lib/agent-os";

const STATUS_DOT: Record<string, string> = {
  idle: "bg-slate-300",
  running: "bg-neon-400 animate-pulse shadow-neon",
  completed: "bg-sky-400",
  failed: "bg-rose-400",
  blocked: "bg-amber-400",
  waiting: "bg-amber-300",
};

export function AgentCard({
  agent,
  selected,
  onSelect,
}: {
  agent: AgentInfo;
  selected: boolean;
  onSelect: () => void;
}) {
  const native = agent.runtime === "biz_os_native";
  const status = native ? agent.status ?? "idle" : agent.enabled ? "idle" : "blocked";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "panel flex flex-col gap-2 p-4 text-left transition-shadow",
        selected ? "shadow-glow border-neon-400/60" : "hover:shadow-glow",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[status] ?? "bg-slate-300"}`} />
        <span className="truncate text-sm font-semibold">{agent.name}</span>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {native ? (
          <span className="pill border-neon-400/40 bg-neon-400/10 text-neon-600">Biz-OS Native</span>
        ) : (
          <span className="pill border-slate-300 bg-slate-100 text-slate-600">GHL Agent Studio</span>
        )}
        {!native && agent.production_status ? (
          <span
            className={[
              "pill",
              agent.production_status === "production"
                ? "border-sky-300 bg-sky-50 text-sky-600"
                : agent.production_status === "staging"
                  ? "border-amber-300 bg-amber-50 text-amber-600"
                  : "border-slate-200 bg-slate-50 text-slate-500",
            ].join(" ")}
          >
            {agent.production_status}
          </span>
        ) : null}
        {!native && agent.mapped_to_ask_ai ? (
          <span className="pill border-neon-400/40 bg-neon-400/10 text-neon-600">Ask AI</span>
        ) : null}
      </div>

      {native && agent.metrics ? (
        <div className="flex gap-3 text-2xs text-muted">
          <span>✓ {agent.metrics.tasks_completed} done</span>
          <span>✗ {agent.metrics.tasks_failed} failed</span>
          <span className="capitalize">{status}</span>
        </div>
      ) : (
        <p className="line-clamp-2 text-2xs text-muted">{agent.description}</p>
      )}

      {native && agent.capabilities?.length ? (
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.slice(0, 3).map((cap) => (
            <span key={cap} className="rounded bg-slate-100 px-1.5 py-0.5 text-2xs text-slate-500">
              {cap}
            </span>
          ))}
          {agent.capabilities.length > 3 ? (
            <span className="text-2xs text-muted">+{agent.capabilities.length - 3}</span>
          ) : null}
        </div>
      ) : null}

      {!native && agent.requires_approval_for_writes ? (
        <p className="text-2xs text-amber-600">Writes held for approval</p>
      ) : null}
    </button>
  );
}
