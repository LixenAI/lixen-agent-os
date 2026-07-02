import type { AssetFolder } from "@lixen/types";
import { FilterIcon, FolderIcon, PlusIcon, SearchIcon } from "../icons";

export function AssetLibrary({ assets }: { assets: AssetFolder[] }) {
  return (
    <section className="panel flex flex-col">
      <h2 className="th border-b border-hairline">Asset Library (Copy / Paste)</h2>
      <div className="flex items-center gap-2 border-b border-hairline p-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-hairline bg-surface px-2.5 py-1.5 focus-within:border-neon-400/50 focus-within:shadow-neon">
          <SearchIcon className="h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-muted"
          />
        </div>
        <button
          aria-label="Filter assets"
          className="rounded-md border border-hairline bg-surface p-1.5 text-muted transition-colors hover:border-neon-400/40 hover:bg-slate-100/50 hover:text-neon-600"
        >
          <FilterIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <ul className="flex flex-col p-1">
        {assets.map((folder) => (
          <li key={folder.id}>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-slate-100/50">
              <FolderIcon className="h-4 w-4 text-neon-500" />
              <span className="font-medium text-ink">{folder.name}</span>
              <span className="ml-auto text-xs text-muted">{folder.count}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="border-t border-hairline p-2">
        <button className="flex w-full items-center justify-center gap-2 rounded-md border border-neon-400/40 bg-neon-400/10 px-3 py-2 text-xs font-medium text-neon-600 transition-colors hover:bg-neon-400/20 hover:shadow-neon">
          <PlusIcon className="h-4 w-4" />
          New Asset
        </button>
      </div>
    </section>
  );
}
