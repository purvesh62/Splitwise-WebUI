"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw, DollarSign, User } from "lucide-react";
import { AnalyticsStats } from "./analytics-stats";
import { SpendingOverTime } from "./spending-over-time";
import { CategoryBreakdown } from "./category-breakdown";
import { GroupComparison } from "./group-comparison";
import { MonthlySummary } from "./monthly-summary";
import { TopExpenses } from "./top-expenses";
import { cn } from "@/lib/utils";
import type { GroupExpense, SplitwiseGroup } from "@/types/splitwise";

export type ViewMode = "total" | "my-share";

export function getExpenseAmount(
  expense: GroupExpense,
  viewMode: ViewMode,
  currentUserId?: number
): number {
  if (viewMode === "total" || !currentUserId) {
    return parseFloat(expense.cost);
  }
  const userEntry = expense.users.find((u) => u.user_id === currentUserId);
  return userEntry ? parseFloat(userEntry.owed_share) : 0;
}

export function AnalyticsDashboard({
  expenses,
  groups,
  currentUserId,
}: {
  expenses: GroupExpense[];
  groups: SplitwiseGroup[];
  currentUserId: number;
}) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedGroup, setSelectedGroup] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<ViewMode>("my-share");

  const filteredExpenses = React.useMemo(() => {
    let result = expenses;

    if (selectedGroup !== "all") {
      result = result.filter(
        (e) => e.group_id === Number(selectedGroup)
      );
    }

    if (dateRange?.from) {
      result = result.filter((e) => {
        const expenseDate = parseISO(e.date);
        if (dateRange.to) {
          return isWithinInterval(expenseDate, {
            start: dateRange.from!,
            end: dateRange.to,
          });
        }
        return expenseDate >= dateRange.from!;
      });
    }

    return result;
  }, [expenses, selectedGroup, dateRange]);

  const activeGroups = groups.filter((g) => g.id !== 0);

  const resetFilters = () => {
    setDateRange(undefined);
    setSelectedGroup("all");
  };

  const hasFilters = dateRange || selectedGroup !== "all";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""}{" "}
            {hasFilters ? "(filtered)" : "total"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md border bg-muted p-0.5">
            <button
              onClick={() => setViewMode("total")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                viewMode === "total"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <DollarSign className="h-3.5 w-3.5" />
              Total Cost
            </button>
            <button
              onClick={() => setViewMode("my-share")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                viewMode === "my-share"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="h-3.5 w-3.5" />
              My Share
            </button>
          </div>

          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All groups</SelectItem>
              {activeGroups.map((group) => (
                <SelectItem key={group.id} value={String(group.id)}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DateRangePicker value={dateRange} onChange={setDateRange} />

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RotateCcw className="mr-1 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pb-2">
        <AnalyticsStats
          expenses={filteredExpenses}
          viewMode={viewMode}
          currentUserId={currentUserId}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <SpendingOverTime
            expenses={filteredExpenses}
            viewMode={viewMode}
            currentUserId={currentUserId}
          />
          <CategoryBreakdown
            expenses={filteredExpenses}
            viewMode={viewMode}
            currentUserId={currentUserId}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <GroupComparison
            expenses={filteredExpenses}
            groups={groups}
            viewMode={viewMode}
            currentUserId={currentUserId}
          />
          <MonthlySummary
            expenses={filteredExpenses}
            currentUserId={currentUserId}
          />
        </div>

        <TopExpenses
          expenses={filteredExpenses}
          groups={groups}
          viewMode={viewMode}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
