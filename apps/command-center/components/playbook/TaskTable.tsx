import { executionStyle, sourceStatusStyle, sourceTagStyle } from "@/lib/badges";
import type { PlaybookItem } from "@lixen/types";
import { FilterIcon, ViewIcon } from "../icons";

export function TaskTable({
  phaseLabel,
  items,
}: {
  phaseLabel: string;
  items: PlaybookItem[];
}) {
  return (
    <section className="panel flex min-w-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-hairline px-3 py-2">
        <h2 className="text-2xs font-semibold uppercase tracking-wide text-ink">
          {phaseLabel}
        </h2>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-1 text-xs text-ink transition-colors hover:border-neon-400/40 hover:bg-slate-100/50 hover:text-neon-600">
            Filter
            <FilterIcon className="h-3.5 w-3.5 text-muted" />
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-1 text-xs text-ink transition-colors hover:border-neon-400/40 hover:bg-slate-100/50 hover:text-neon-600">
            View
            <ViewIcon className="h-3.5 w-3.5 text-muted" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline">
              <th className="th w-10">#</th>
              <th className="th">Task / Item</th>
              <th className="th">Status</th>
              <th className="th">Execution Status</th>
              <th className="th">Owner</th>
              <th className="th">Due Date</th>
              <th className="th">Source</th>
              <th className="th">Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-hairline transition-colors last:border-0 hover:bg-neon-400/5 hover:shadow-[inset_0_0_0_1px_rgba(91,184,255,0.18)]"
              >
                <td className="td text-muted">{item.id}</td>
                <td className="td font-medium">{item.title}</td>
                <td className="td">
                  <span className={`pill ${sourceStatusStyle[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className={`td ${executionStyle[item.execution]}`}>
                  {item.execution}
                </td>
                <td className="td text-muted">{item.owner}</td>
                <td className="td text-muted">{item.dueDate}</td>
                <td className="td">
                  <span className={`pill ${sourceTagStyle[item.source]}`}>
                    {item.source}
                  </span>
                </td>
                <td className="td text-muted">{item.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
