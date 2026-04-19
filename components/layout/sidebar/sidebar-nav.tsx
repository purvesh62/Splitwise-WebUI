"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronDown,
  Home,
  Pin,
  PinOff,
  Search,
  Settings,
  Users,
} from "lucide-react";
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

const PINNED_GROUPS_KEY = "wisesplit-pinned-groups";

function usePinnedGroups() {
  const [pinned, setPinned] = React.useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem(PINNED_GROUPS_KEY);
      return stored ? new Set(JSON.parse(stored) as number[]) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggle = React.useCallback((groupId: number) => {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      localStorage.setItem(PINNED_GROUPS_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { pinned, toggle };
}

function SidebarItem({
  href,
  icon: Icon,
  label,
  isCollapsed,
  onClick,
  trailing,
  isInactive,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  onClick?: () => void;
  trailing?: React.ReactNode;
  isInactive?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const content = (
    <div className="group relative flex items-center">
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : isInactive
            ? "text-sidebar-foreground/40 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground/60"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!isCollapsed && (
          <span className="truncate max-w-[140px]" title={label}>
            {label}
          </span>
        )}
        {!isCollapsed && isInactive && (
          <span className="ml-1 shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Inactive
          </span>
        )}
        {!isCollapsed && trailing && (
          <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            {trailing}
          </span>
        )}
      </Link>
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {label}
          {isInactive ? " (Inactive)" : ""}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

const INACTIVE_THRESHOLD_MS = 90 * 24 * 60 * 60 * 1000;

function isGroupInactive(group: SplitwiseGroup): boolean {
  if (!group.updated_at) return false;
  const updated = new Date(group.updated_at).getTime();
  if (Number.isNaN(updated)) return false;
  return Date.now() - updated > INACTIVE_THRESHOLD_MS;
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
  const { pinned, toggle } = usePinnedGroups();

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedGroups = filteredGroups.filter((g) => pinned.has(g.id));
  const unpinnedGroups = filteredGroups.filter((g) => !pinned.has(g.id));
  const sortedGroups = [...pinnedGroups, ...unpinnedGroups];

  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <div className="space-y-0.5 px-2 py-2">
          <SidebarItem
            href="/"
            icon={Home}
            label="Dashboard"
            isCollapsed={isCollapsed}
            onClick={closeMobile}
          />
          <SidebarItem
            href="/analytics"
            icon={BarChart3}
            label="Analytics"
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
                    className="h-9 pl-8"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {pinnedGroups.length > 0 && !isCollapsed && (
                <>
                  {pinnedGroups.map((group) => (
                    <SidebarItem
                      key={group.id}
                      href={`/group/${group.id}`}
                      icon={Users}
                      label={group.name}
                      isCollapsed={isCollapsed}
                      isInactive={isGroupInactive(group)}
                      onClick={closeMobile}
                      trailing={
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggle(group.id);
                          }}
                          className="p-0.5 rounded hover:bg-sidebar-accent"
                        >
                          <PinOff className="h-3 w-3 text-sidebar-foreground/50" />
                        </button>
                      }
                    />
                  ))}
                  <div className="mx-3 my-1 border-t border-sidebar-border" />
                </>
              )}
              {unpinnedGroups.map((group) => (
                <SidebarItem
                  key={group.id}
                  href={`/group/${group.id}`}
                  icon={Users}
                  label={group.name}
                  isCollapsed={isCollapsed}
                  isInactive={isGroupInactive(group)}
                  onClick={closeMobile}
                  trailing={
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggle(group.id);
                      }}
                      className="p-0.5 rounded hover:bg-sidebar-accent"
                    >
                      <Pin className="h-3 w-3 text-sidebar-foreground/50" />
                    </button>
                  }
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
