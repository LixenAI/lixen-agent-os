import { getCommandCenterState } from "@/lib/data";

export default function OverviewPage() {
  const { phases, checklist, benchmark } = getCommandCenterState();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Overview
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="panel p-4">
          <p className="text-2xs uppercase tracking-wide text-muted">
            Overall Checklist Completion
          </p>
          <p className="mt-1 text-3xl font-bold">{checklist.percent}%</p>
          <p className="text-xs text-muted">
            {checklist.completed} / {checklist.total} items
          </p>
        </div>
        <div className="panel p-4">
          <p className="text-2xs uppercase tracking-wide text-muted">
            Benchmark Readiness
          </p>
          <p className="mt-1 text-3xl font-bold">{benchmark.percent}%</p>
          <p className="text-xs text-muted">Baseline {benchmark.baselineDate}</p>
        </div>
        <div className="panel p-4">
          <p className="text-2xs uppercase tracking-wide text-muted">Phases</p>
          <p className="mt-1 text-3xl font-bold">{phases.length}</p>
          <p className="text-xs text-muted">Foundation → Optimize</p>
        </div>
      </div>
      <div className="panel p-4">
        <h3 className="th px-0">Phase Progress</h3>
        <ul className="mt-2 flex flex-col gap-3">
          {phases.map((phase) => (
            <li key={phase.id} className="flex items-center gap-3">
              <span className="w-40 text-sm font-medium">
                {phase.index}. {phase.name}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-500 to-neon-300 shadow-neon"
                  style={{ width: `${phase.completion}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs font-semibold text-muted">
                {phase.completion}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
