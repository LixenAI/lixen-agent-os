"use client";

import { useState } from "react";
import { PACKAGES, upgradeSentence, type PackageTier } from "@/lib/packages";

export function PackageToggle() {
  const [tier, setTier] = useState<PackageTier>("starter");

  return (
    <div className="flex flex-col gap-1">
      <p className="max-w-[20rem] text-2xs leading-tight text-muted">
        {upgradeSentence(tier)}
      </p>
      <div
        role="radiogroup"
        aria-label="Active package"
        className="inline-flex items-center gap-1 rounded-md border border-hairline bg-surface p-0.5"
      >
        {(Object.keys(PACKAGES) as PackageTier[]).map((t) => {
          const active = tier === t;
          return (
            <button
              key={t}
              role="radio"
              aria-checked={active}
              onClick={() => setTier(t)}
              className={[
                "rounded px-2.5 py-1 text-2xs font-semibold uppercase tracking-wide transition-colors",
                active
                  ? "bg-neon-400/15 text-neon-600 shadow-neon ring-1 ring-neon-400/50"
                  : "text-muted hover:text-ink",
              ].join(" ")}
            >
              {PACKAGES[t].shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
