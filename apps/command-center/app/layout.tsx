import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ChatWidget } from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "LixenAI Launch Command Center",
  description:
    "Internal launch playbook, tracker, and copy/paste library for the LixenAI AI Agency Partner Program.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
        <ChatWidget />
      </body>
    </html>
  );
}
