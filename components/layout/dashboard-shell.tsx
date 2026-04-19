"use client";

import { SidebarProvider } from "@/hooks/use-sidebar";
import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { Header } from "@/components/layout/header";
import type { SplitwiseUser, SplitwiseGroup } from "@/types/splitwise";

export function DashboardShell({
  user,
  groups,
  children,
}: {
  user: SplitwiseUser;
  groups: SplitwiseGroup[];
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar groups={groups} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header user={user} />
          <div className="flex-1 overflow-y-auto p-4">
            <main className="h-full rounded-lg border bg-card p-6 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
