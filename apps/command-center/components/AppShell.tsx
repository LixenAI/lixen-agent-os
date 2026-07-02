import type { ReactNode } from "react";
import { getCommandCenterState } from "@/lib/data";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";

export function AppShell({ children }: { children: ReactNode }) {
  const { checklist, benchmark, sync, operator } = getCommandCenterState();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          checklist={checklist}
          benchmark={benchmark}
          sync={sync}
          operator={operator}
        />
        <main className="flex-1 overflow-auto px-6 py-4">
          {children}
        </main>
        <StatusBar sync={sync} />
      </div>
    </div>
  );
}
