"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BarChart3,
  ChevronDown,
  Home,
  LogOut,
  Moon,
  Pin,
  PinOff,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { useApiKey } from "@/hooks/use-api-key";
import { authClient } from "@/lib/auth/client";
import { clearApiKeyCookie } from "@/server/actions/api-key";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";
import type {
  SplitwiseFriend,
  SplitwiseGroup,
  SplitwiseUser,
} from "@/types/splitwise";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as React from "react";

const PINNED_GROUPS_KEY = "wisesplit-pinned-groups";

function usePinnedGroups() {
  const [pinned, setPinned] = React.useState<Set<number>>(() => new Set());
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(PINNED_GROUPS_KEY);
      if (stored) {
        setPinned(new Set(JSON.parse(stored) as number[]));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const toggle = React.useCallback((groupId: number) => {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      try {
        localStorage.setItem(PINNED_GROUPS_KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { pinned, toggle, hydrated };
}

function SidebarItem({
  href,
  icon: Icon,
  label,
  isCollapsed,
  onClick,
  trailing,
  muted,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  onClick?: () => void;
  trailing?: React.ReactNode;
  muted?: boolean;
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
            : muted
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
  action,
}: {
  label: string;
  children: React.ReactNode;
  isCollapsed: boolean;
  defaultOpen?: boolean;
  action?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  if (isCollapsed) return <>{children}</>;

  return (
    <div>
      <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-1 items-center justify-between"
        >
          <span>{label}</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform",
              isOpen ? "rotate-0" : "-rotate-90"
            )}
          />
        </button>
        {action && <div className="ml-2 flex items-center">{action}</div>}
      </div>
      {isOpen && children}
    </div>
  );
}

function SidebarUserMenu({
  user,
  isCollapsed,
  onNavigate,
}: {
  user: SplitwiseUser;
  isCollapsed: boolean;
  onNavigate: () => void;
}) {
  const router = useRouter();
  const { clearApiKey } = useApiKey();

  async function handleLogout() {
    clearApiKey();
    await clearApiKeyCookie();
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  const trigger = (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <Avatar className="h-5 w-5 shrink-0">
        {user.picture?.medium && <AvatarImage src={user.picture.medium} />}
        <AvatarFallback className="text-[10px]">
          {user.first_name?.[0]}
          {user.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <span className="truncate">{user.first_name}</span>
      )}
    </button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {user.first_name} {user.last_name}
            </TooltipContent>
          </Tooltip>
        ) : (
          trigger
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/settings" onClick={onNavigate}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarThemeToggle({ isCollapsed }: { isCollapsed: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme ?? resolvedTheme : "light";
  const isDark = currentTheme === "dark";

  const content = (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      {isDark ? (
        <Moon className="h-4 w-4 shrink-0" />
      ) : (
        <Sun className="h-4 w-4 shrink-0" />
      )}
      {!isCollapsed && (
        <span>{isDark ? "Dark mode" : "Light mode"}</span>
      )}
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Toggle theme
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function SidebarNav({
  groups,
  user,
  friends,
}: {
  groups: SplitwiseGroup[];
  user: SplitwiseUser;
  friends: SplitwiseFriend[];
}) {
  const { isCollapsed, setMobileOpen } = useSidebar();
  const [search, setSearch] = React.useState("");
  const [createGroupOpen, setCreateGroupOpen] = React.useState(false);
  const closeMobile = () => setMobileOpen(false);
  const { pinned, toggle, hydrated } = usePinnedGroups();

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  // Until hydrated, treat no groups as pinned so server/client markup match.
  const pinnedGroups = hydrated
    ? filteredGroups.filter((g) => pinned.has(g.id))
    : [];
  const unpinnedGroups = hydrated
    ? filteredGroups.filter((g) => !pinned.has(g.id))
    : filteredGroups;
  const activeUnpinned = unpinnedGroups.filter((g) => !isGroupInactive(g));
  const inactiveUnpinned = unpinnedGroups.filter((g) => isGroupInactive(g));

  const renderGroupItem = (group: SplitwiseGroup, isPinned: boolean) => (
    <SidebarItem
      key={group.id}
      href={`/group/${group.id}`}
      icon={Users}
      label={group.name}
      isCollapsed={isCollapsed}
      muted={isGroupInactive(group)}
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
          {isPinned ? (
            <PinOff className="h-3 w-3 text-sidebar-foreground/50" />
          ) : (
            <Pin className="h-3 w-3 text-sidebar-foreground/50" />
          )}
        </button>
      }
    />
  );

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
          {!isCollapsed && (
            <div className="px-1 py-2">
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

          {pinnedGroups.length > 0 && (
            <SidebarSection label="Pinned Groups" isCollapsed={isCollapsed}>
              <div className="flex flex-col gap-0.5">
                {pinnedGroups.map((group) => renderGroupItem(group, true))}
              </div>
            </SidebarSection>
          )}

          <SidebarSection
            label="Groups"
            isCollapsed={isCollapsed}
            action={
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCreateGroupOpen(true)}
                    className="flex h-5 w-5 items-center justify-center rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    aria-label="Create group"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  Create group
                </TooltipContent>
              </Tooltip>
            }
          >
            <div className="flex flex-col gap-0.5">
              {activeUnpinned.map((group) => renderGroupItem(group, false))}
              {!isCollapsed && filteredGroups.length === 0 && (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  No groups found.
                </p>
              )}
            </div>
          </SidebarSection>

          {inactiveUnpinned.length > 0 && (
            <SidebarSection
              label="Inactive Groups"
              isCollapsed={isCollapsed}
              defaultOpen={false}
            >
              <div className="flex flex-col gap-0.5">
                {inactiveUnpinned.map((group) => renderGroupItem(group, false))}
              </div>
            </SidebarSection>
          )}
        </ScrollArea>

        <div className="border-t border-sidebar-border px-2 py-2 space-y-0.5">
          <SidebarThemeToggle isCollapsed={isCollapsed} />
          <SidebarUserMenu
            user={user}
            isCollapsed={isCollapsed}
            onNavigate={closeMobile}
          />
        </div>
      </div>

      <CreateGroupDialog
        friends={friends}
        open={createGroupOpen}
        onOpenChange={setCreateGroupOpen}
      />
    </TooltipProvider>
  );
}
