"use client";

import type { Approval, AuditLog, CommandItem } from "@/lib/agent-os";

function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${Math.floor(seconds)}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function CommandQueue({ items }: { items: CommandItem[] }) {
  return (
    <div className="panel p-4">
      <h3 className="th px-0">Command Queue</h3>
      {items.length === 0 ? (
        <p className="mt-1 text-xs text-muted">No open command items.</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {items.slice(0, 6).map((item) => (
            <li key={item.id} className="flex items-start gap-2">
              <span
                className={[
                  "mt-0.5 w-10 shrink-0 rounded text-center text-2xs font-bold",
                  item.priority_score >= 60
                    ? "bg-rose-50 text-rose-500"
                    : item.priority_score >= 30
                      ? "bg-amber-50 text-amber-600"
                      : "bg-slate-100 text-slate-500",
                ].join(" ")}
              >
                {item.priority_score}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{item.title}</p>
                <p className="text-2xs text-muted">
                  {item.command_type.replace(/_/g, " ")}
                  {item.requires_approval ? " · needs approval" : ""} ·{" "}
                  {timeAgo(item.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ApprovalsQueue({ approvals }: { approvals: Approval[] }) {
  const pending = approvals.filter((a) => a.status === "pending");
  return (
    <div className="panel p-4">
      <h3 className="th px-0">Approvals</h3>
      {pending.length === 0 ? (
        <p className="mt-1 text-xs text-muted">Nothing pending.</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {pending.slice(0, 5).map((a) => (
            <li key={a.id} className="rounded-md border border-amber-200 bg-amber-50/60 p-2">
              <p className="text-xs font-medium text-amber-700">{a.reason}</p>
              <p className="text-2xs text-muted">
                run {a.agent_run_id} · {timeAgo(a.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function GatesPanel({ gates }: { gates: Record<string, boolean> }) {
  const entries = Object.entries(gates);
  const passed = entries.filter(([, ok]) => ok).length;
  return (
    <div className="panel p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="th px-0">Go-Live Gates</h3>
        <span className="text-2xs font-semibold text-muted">
          {passed}/{entries.length}
        </span>
      </div>
      <ul className="mt-2 flex flex-col gap-1.5">
        {entries.map(([name, ok]) => (
          <li key={name} className="flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${ok ? "bg-sky-400" : "bg-slate-300"}`}
            />
            <span className={ok ? "text-ink" : "text-muted"}>
              {name.replace(/_/g, " ")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AuditTrail({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="panel p-4">
      <h3 className="th px-0">Audit Trail</h3>
      {logs.length === 0 ? (
        <p className="mt-1 text-xs text-muted">
          No audit events yet. Agent results and risky actions land here.
        </p>
      ) : (
        <table className="mt-2 w-full">
          <thead>
            <tr className="border-b border-hairline">
              <th className="th pl-0">Actor</th>
              <th className="th">Action</th>
              <th className="th">Entity</th>
              <th className="th">Risk</th>
              <th className="th pr-0 text-right">When</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(0, 8).map((log) => (
              <tr key={log.id} className="border-b border-hairline/60 last:border-0">
                <td className="td pl-0 text-xs">
                  <span className="pill border-slate-200 bg-slate-50 text-slate-500">
                    {log.actor_type}
                  </span>{" "}
                  {log.actor_id}
                </td>
                <td className="td text-xs">{log.action.replace(/_/g, " ")}</td>
                <td className="td text-xs text-muted">
                  {log.entity_type}:{log.entity_id}
                </td>
                <td className="td text-xs">
                  <span
                    className={[
                      "pill",
                      log.risk_level === "high"
                        ? "border-rose-200 bg-rose-50 text-rose-500"
                        : "border-slate-200 bg-slate-50 text-slate-500",
                    ].join(" ")}
                  >
                    {log.risk_level}
                  </span>
                </td>
                <td className="td pr-0 text-right text-2xs text-muted">
                  {timeAgo(log.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
