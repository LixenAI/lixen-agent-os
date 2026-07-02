import type { SyncState } from "@/lib/types";
import { CheckCircleIcon, CloudIcon } from "./icons";

export function StatusBar({ sync }: { sync: SyncState }) {
  return (
    <footer className="flex items-center gap-8 border-t border-hairline bg-slate-950/70 px-6 py-2 text-2xs text-slate-300 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <CheckCircleIcon className="h-4 w-4 text-neon-400 drop-shadow-[0_0_6px_rgba(86,168,255,0.6)]" />
        <span>Sync Status: {sync.message}</span>
      </div>
      <div className="flex items-center gap-2">
        <CloudIcon className="h-4 w-4 text-neon-300/70" />
        <span>Storage: {sync.storage}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="uppercase tracking-wide text-muted">
          Source of Truth:
        </span>
        <span className="pill border-neon-500/50 bg-neon-500/15 text-neon-300 shadow-neon">
          {sync.sourceOfTruth}
        </span>
      </div>
    </footer>
  );
}
