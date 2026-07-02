import type { ExecutionStatus, SourceStatus } from "@lixen/types";

// Light-theme status pills: pastel fills, soft borders, high-contrast text.
// No green. No dark backgrounds.
export const sourceStatusStyle: Record<SourceStatus, string> = {
  GATE: "border-rose-200 bg-rose-50 text-rose-700",
  LIVE: "border-sky-200 bg-sky-50 text-sky-700",
  RISK: "border-amber-200 bg-amber-50 text-amber-700",
  DRAFT: "border-orange-200 bg-orange-50 text-orange-700",
  VALIDATE: "border-violet-200 bg-violet-50 text-violet-700",
};

export const executionStyle: Record<ExecutionStatus, string> = {
  "Not Started": "text-slate-400",
  "In Progress": "text-neon-500",
  Blocked: "text-rose-600",
  Done: "text-sky-600",
};

export const sourceTagStyle: Record<string, string> = {
  CANONICAL: "border-neon-400/40 bg-neon-400/10 text-neon-600",
  DRAFT: "border-orange-200 bg-orange-50 text-orange-700",
  LIVE: "border-sky-200 bg-sky-50 text-sky-700",
};
