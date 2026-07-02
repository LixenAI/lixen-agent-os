"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LibraryIcon,
  OverviewIcon,
  PlaybookIcon,
  TrackerIcon,
  SettingsIcon,
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
    <aside className="flex w-56 shrink-0 flex-col border-r border-hairline bg-white/80 text-slate-600 backdrop-blur-xl">
      <div className="flex h-14 items-center border-b border-hairline px-5">
        <span className="text-lg font-extrabold tracking-tight [text-shadow:0_0_18px_rgba(91,184,255,0.45)]">
          <span className="text-slate-900">LIX</span>
          <span className="text-neon-500">EN</span>
          <span className="text-neon-500">AI</span>
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
                  ? "border border-neon-400/40 bg-neon-400/10 text-neon-600 shadow-neon"
                  : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900",
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
