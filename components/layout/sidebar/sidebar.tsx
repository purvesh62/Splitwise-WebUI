"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarNav } from "./sidebar-nav";
import { Landmark } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type {
  SplitwiseFriend,
  SplitwiseGroup,
  SplitwiseUser,
} from "@/types/splitwise";
import Link from "next/link";

function SidebarHeader({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className="flex h-14 items-center border-b border-sidebar-border px-3">
      <Link href="/" className="flex items-center gap-2">
        <Landmark className="h-5 w-5 text-emerald-600" />
        {!isCollapsed && (
          <span className="text-lg font-semibold tracking-tight">WiseSplit</span>
        )}
      </Link>
    </div>
  );
}

export function Sidebar({
  groups,
  user,
  friends,
}: {
  groups: SplitwiseGroup[];
  user: SplitwiseUser;
  friends: SplitwiseFriend[];
}) {
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebar();
  const isMobile = useIsMobile();

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar">
      <SidebarHeader isCollapsed={isMobile ? false : isCollapsed} />
      <SidebarNav groups={groups} user={user} friends={friends} />
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 border-r border-sidebar-border md:block transition-all duration-200",
        isCollapsed ? "w-14" : "w-64"
      )}
    >
      {sidebarContent}
    </aside>
  );
}
