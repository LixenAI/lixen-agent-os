"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LibraryIcon,
  OverviewIcon,
  PlaybookIcon,
  SettingsIcon,
  TrackerIcon,
} from "./icons";

const NAV = [
  { href: "/overview", label: "Overview", Icon: OverviewIcon },
  { href: "/playbook", label: "Playbook", Icon: PlaybookIcon },
  { href: "/tracker", label: "Tracker", Icon: TrackerIcon },
  { href: "/library", label: "Library", Icon: LibraryIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-hairline bg-slate-950/70 text-slate-300 backdrop-blur-xl">
      <div className="flex h-14 items-center border-b border-hairline px-5">
        <span className="text-lg font-extrabold tracking-tight [text-shadow:0_0_18px_rgba(86,168,255,0.45)]">
          <span className="text-white">LIX</span>
          <span className="text-neon-400">EN</span>
          <span className="text-neon-300">AI</span>
        </span>
      </div>
      <nav className="mt-2 flex flex-col gap-1 px-3">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || (href === "/playbook" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border border-neon-500/40 bg-neon-500/15 text-neon-300 shadow-neon"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
