// Source status labels (from the canonical benchmark) are kept separate from
// execution progress, per the operational-tool requirement.

export type SourceStatus = "GATE" | "LIVE" | "RISK" | "DRAFT" | "VALIDATE";

export type ExecutionStatus =
  | "Not Started"
  | "In Progress"
  | "Blocked"
  | "Done";

export interface PlaybookPhase {
  id: string;
  index: number;
  name: string;
  completion: number; // 0-100
}

export interface PlaybookItem {
  id: string; // e.g. "1.1"
  phaseId: string;
  title: string;
  status: SourceStatus; // canonical source label
  execution: ExecutionStatus; // operational progress
  owner: string;
  dueDate: string;
  source: "CANONICAL" | "DRAFT" | "LIVE";
  updated: string;
}

export interface TrackerItem {
  id: string;
  title: string;
  phase: string;
  dueDate: string;
  status: SourceStatus;
}

export interface AssetFolder {
  id: string;
  name: string;
  count: number;
}

export interface BenchmarkReadiness {
  baselineDate: string; // dated baseline
  percent: number;
}

export interface ChecklistSummary {
  percent: number;
  completed: number;
  total: number;
}

export interface SyncState {
  message: string;
  storage: string;
  sourceOfTruth: string;
}

export interface OperatorProfile {
  name: string;
  org: string;
  initials: string;
}

export interface CommandCenterState {
  checklist: ChecklistSummary;
  benchmark: BenchmarkReadiness;
  phases: PlaybookPhase[];
  items: PlaybookItem[];
  tracker: TrackerItem[];
  assets: AssetFolder[];
  sync: SyncState;
  operator: OperatorProfile;
}