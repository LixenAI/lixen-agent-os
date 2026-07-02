import type { BenchmarkReadiness, ChecklistSummary, OperatorProfile, SyncState } from "@/lib/types";
import { ChevronDownIcon, CloudIcon, SourceIcon } from "./icons";
import { PackageToggle } from "./PackageToggle";

interface HeaderProps {
  checklist: ChecklistSummary;
  benchmark: BenchmarkReadiness;
  sync: SyncState;
  operator: OperatorProfile;
}

export function Header({ checklist, benchmark, sync, operator }: HeaderProps) {
  return (
    <header className="border-b border-hairline bg-slate-950/60 backdrop-blur-xl">
      <div className="flex items-center gap-6 px-6 py-3">
        <div className="min-w-[14rem]">
          <h1 className="text-base font-bold leading-tight text-ink [text-shadow:0_0_16px_rgba(86,168,255,0.25)]">
            LixenAI Launch Command Center
          </h1>
          <p className="text-xs text-muted">
            You close. We build, deploy, and deliver.
          </p>
        </div>

        <div className="hidden flex-1 items-center gap-6 lg:flex">
          <KpiChecklist checklist={checklist} />
          <Divider />
          <KpiBenchmark benchmark={benchmark} />
          <Divider />
          <PackageToggle />
        </div>

        <div className="ml-auto flex items-center gap-5">
          <div className="hidden items-center gap-2 text-2xs text-muted xl:flex">
            <CloudIcon className="h-4 w-4 text-neon-400" />
            <span>{sync.message}</span>
          </div>
          <div className="hidden items-center gap-2 text-2xs text-muted xl:flex">
            <SourceIcon className="h-4 w-4 text-muted" />
            <div className="leading-tight">
              <p className="text-[0.625rem] uppercase tracking-wide">Source</p>
              <p className="font-semibold text-ink">Canonical</p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-md border border-hairline bg-slate-900/40 px-2 py-1 transition-colors hover:border-neon-500/40 hover:bg-slate-800/60">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-neon-500/40 bg-slate-800 text-2xs font-bold text-neon-300 shadow-neon">
              {operator.initials}
            </span>
            <span className="text-left leading-tight">
              <span className="block text-xs font-semibold text-ink">
                {operator.name}
              </span>
              <span className="block text-[0.625rem] text-muted">
                {operator.org}
              </span>
            </span>
            <ChevronDownIcon className="h-3.5 w-3.5 text-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Divider() {
  return <div className="h-9 w-px bg-gradient-to-b from-transparent via-neon-500/30 to-transparent" />;
}

function KpiChecklist({ checklist }: { checklist: ChecklistSummary }) {
  return (
    <div className="min-w-[15rem]">
      <p className="text-2xs uppercase tracking-wide text-muted">
        Overall Checklist Completion
      </p>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-2xl font-bold leading-none text-ink">
          {checklist.percent}%
        </span>
        <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-800/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-500 to-neon-300 shadow-neon"
            style={{ width: `${checklist.percent}%` }}
          />
        </div>
        <span className="text-xs text-muted">
          {checklist.completed} / {checklist.total}
        </span>
      </div>
    </div>
  );
}

function KpiBenchmark({ benchmark }: { benchmark: BenchmarkReadiness }) {
  return (
    <div>
      <p className="text-2xs uppercase tracking-wide text-muted">
        Benchmark Readiness (Dated Baseline)
      </p>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-sm font-semibold text-ink">
          {benchmark.baselineDate}
        </span>
        <span className="text-2xl font-bold leading-none text-ink">
          {benchmark.percent}%
        </span>
      </div>
    </div>
  );
}
