import type { PlaybookPhase } from "@/lib/types";
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
                    ? "border border-neon-500/40 bg-neon-500/15 text-neon-300 shadow-neon"
                    : "text-ink hover:bg-white/5",
                ].join(" ")}
              >
                <span className="font-medium">
                  {phase.index}. {phase.name}
                </span>
                <span
                  className={[
                    "ml-auto text-xs font-semibold",
                    active ? "text-neon-300" : "text-muted",
                  ].join(" ")}
                >
                  {phase.completion}%
                </span>
                <ChevronRightIcon
                  className={[
                    "h-3.5 w-3.5",
                    active ? "text-neon-300" : "text-muted",
                  ].join(" ")}
                />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto border-t border-hairline p-2">
        <button className="flex w-full items-center justify-center gap-2 rounded-md border border-hairline px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-neon-500/40 hover:bg-white/5 hover:text-neon-300">
          <ViewIcon className="h-4 w-4" />
          View All Items
        </button>
      </div>
    </section>
  );
}
