import Link from "next/link";
import { sourceStatusStyle } from "@/lib/badges";
import type { TrackerItem } from "@/lib/types";
import { ArrowRightIcon } from "../icons";

export function LaunchTracker({ tracker }: { tracker: TrackerItem[] }) {
  return (
    <section className="panel flex flex-col">
      <h2 className="th border-b border-hairline">Launch Tracker (Upcoming)</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline">
              <th className="th">Item</th>
              <th className="th">Phase</th>
              <th className="th">Due Date</th>
              <th className="th">Status</th>
            </tr>
          </thead>
          <tbody>
            {tracker.map((row) => (
              <tr
                key={row.id}
                className="border-b border-hairline transition-colors last:border-0 hover:bg-neon-500/5 hover:shadow-[inset_0_0_0_1px_rgba(86,168,255,0.18)]"
              >
                <td className="td font-medium">{row.title}</td>
                <td className="td text-muted">{row.phase}</td>
                <td className="td text-muted">{row.dueDate}</td>
                <td className="td">
                  <span className={`pill ${sourceStatusStyle[row.status]}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-hairline p-2 text-center">
        <Link
          href="/tracker"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neon-400 transition-colors hover:text-neon-300"
        >
          View Full Tracker
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
