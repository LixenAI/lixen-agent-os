import type { ExecutionStatus, SourceStatus } from "./types";

// Status pills tuned for the dark glass canvas: translucent fills, glowing
// borders, and high-contrast text. Semantic colors are kept restrained.
export const sourceStatusStyle: Record<SourceStatus, string> = {
  GATE: "border-rose-400/40 text-rose-300 bg-rose-500/10",
  LIVE: "border-emerald-400/40 text-emerald-300 bg-emerald-500/10",
  RISK: "border-amber-400/40 text-amber-300 bg-amber-500/10",
  DRAFT: "border-orange-400/40 text-orange-300 bg-orange-500/10",
  VALIDATE: "border-violet-400/40 text-violet-300 bg-violet-500/10",
};

export const executionStyle: Record<ExecutionStatus, string> = {
  "Not Started": "text-muted",
  "In Progress": "text-neon-300",
  Blocked: "text-rose-300",
  Done: "text-emerald-300",
};

export const sourceTagStyle: Record<string, string> = {
  CANONICAL: "border-neon-500/40 text-neon-300 bg-neon-500/10",
  DRAFT: "border-orange-400/40 text-orange-300 bg-orange-500/10",
  LIVE: "border-emerald-400/40 text-emerald-300 bg-emerald-500/10",
};
