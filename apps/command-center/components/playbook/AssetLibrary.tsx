import type { AssetFolder } from "@/lib/types";
import { FilterIcon, FolderIcon, PlusIcon, SearchIcon } from "../icons";

export function AssetLibrary({ assets }: { assets: AssetFolder[] }) {
  return (
    <section className="panel flex flex-col">
      <h2 className="th border-b border-hairline">Asset Library (Copy / Paste)</h2>
      <div className="flex items-center gap-2 border-b border-hairline p-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-hairline bg-slate-900/40 px-2.5 py-1.5 focus-within:border-neon-500/50 focus-within:shadow-neon">
          <SearchIcon className="h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-muted"
          />
        </div>
        <button
          aria-label="Filter assets"
          className="rounded-md border border-hairline bg-slate-900/40 p-1.5 text-muted transition-colors hover:border-neon-500/40 hover:bg-white/5 hover:text-neon-300"
        >
          <FilterIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <ul className="flex flex-col p-1">
        {assets.map((folder) => (
          <li key={folder.id}>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-white/5">
              <FolderIcon className="h-4 w-4 text-neon-400" />
              <span className="font-medium text-ink">{folder.name}</span>
              <span className="ml-auto text-xs text-muted">{folder.count}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="border-t border-hairline p-2">
        <button className="flex w-full items-center justify-center gap-2 rounded-md border border-neon-500/40 bg-neon-500/10 px-3 py-2 text-xs font-medium text-neon-300 transition-colors hover:bg-neon-500/20 hover:shadow-neon">
          <PlusIcon className="h-4 w-4" />
          New Asset
        </button>
      </div>
    </section>
  );
}
