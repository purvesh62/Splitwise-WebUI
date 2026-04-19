"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Home, Search, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import type { SplitwiseGroup } from "@/types/splitwise";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as React from "react";

function SidebarItem({
  href,
  icon: Icon,
  label,
  isCollapsed,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const content = (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && (
        <span className="truncate max-w-[160px]" title={label}>
          {label}
        </span>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

function SidebarSection({
  label,
  children,
  isCollapsed,
  defaultOpen = true,
}: {
  label: string;
  children: React.ReactNode;
  isCollapsed: boolean;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  if (isCollapsed) return <>{children}</>;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50"
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform",
            isOpen ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      {isOpen && children}
    </div>
  );
}

export function SidebarNav({ groups }: { groups: SplitwiseGroup[] }) {
  const { isCollapsed, setMobileOpen } = useSidebar();
  const [search, setSearch] = React.useState("");
  const closeMobile = () => setMobileOpen(false);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <div className="px-2 py-2">
          <SidebarItem
            href="/"
            icon={Home}
            label="Dashboard"
            isCollapsed={isCollapsed}
            onClick={closeMobile}
          />
        </div>

        <ScrollArea className="flex-1 px-2">
          <SidebarSection label="Groups" isCollapsed={isCollapsed}>
            {!isCollapsed && (
              <div className="px-1 pb-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search groups..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {filteredGroups.map((group) => (
                <SidebarItem
                  key={group.id}
                  href={`/group/${group.id}`}
                  icon={Users}
                  label={group.name}
                  isCollapsed={isCollapsed}
                  onClick={closeMobile}
                />
              ))}
              {!isCollapsed && filteredGroups.length === 0 && (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  No groups found.
                </p>
              )}
            </div>
          </SidebarSection>
        </ScrollArea>

        <div className="border-t border-sidebar-border px-2 py-2">
          <SidebarItem
            href="/settings"
            icon={Settings}
            label="Settings"
            isCollapsed={isCollapsed}
            onClick={closeMobile}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
