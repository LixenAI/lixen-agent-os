import type { PlaybookPhase } from "@lixen/types";
import { ChevronRightIcon, ViewIcon } from "../icons";

export function PhasesCard({
  phases,
  activePhaseId,
}: {
  phases: PlaybookPhase[];
  activePhaseId: string;
}) {
  return (
    <section className="panel flex w-60 shrink-0 flex-col">
      <h2 className="th border-b border-hairline">Playbook Phases</h2>
      <ul className="flex flex-col p-2">
        {phases.map((phase) => {
          const active = phase.id === activePhaseId;
          return (
            <li key={phase.id}>
              <button
                className={[
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "border border-neon-400/40 bg-neon-400/10 text-neon-600 shadow-neon"
                    : "text-ink hover:bg-slate-100/50",
                ].join(" ")}
              >
                <span className="font-medium">
                  {phase.index}. {phase.name}
                </span>
                <span
                  className={[
                    "ml-auto text-xs font-semibold",
                    active ? "text-neon-600" : "text-muted",
                  ].join(" ")}
                >
                  {phase.completion}%
                </span>
                <ChevronRightIcon
                  className={[
                    "h-3.5 w-3.5",
                    active ? "text-neon-600" : "text-muted",
                  ].join(" ")}
                />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto border-t border-hairline p-2">
        <button className="flex w-full items-center justify-center gap-2 rounded-md border border-hairline px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-neon-400/40 hover:bg-slate-100/50 hover:text-neon-600">
          <ViewIcon className="h-4 w-4" />
          View All Items
        </button>
      </div>
    </section>
  );
}
