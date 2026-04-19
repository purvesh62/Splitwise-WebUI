"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { DollarSign, Receipt, TrendingUp, Calendar } from "lucide-react";
import type { GroupExpense } from "@/types/splitwise";
import { type ViewMode, getExpenseAmount } from "./analytics-dashboard";

export function AnalyticsStats({
  expenses,
  viewMode,
  currentUserId,
}: {
  expenses: GroupExpense[];
  viewMode: ViewMode;
  currentUserId: number;
}) {
  const totalSpent = expenses.reduce(
    (sum, e) => sum + getExpenseAmount(e, viewMode, currentUserId),
    0
  );
  const relevantExpenses =
    viewMode === "my-share"
      ? expenses.filter(
          (e) => getExpenseAmount(e, viewMode, currentUserId) > 0
        )
      : expenses;
  const avgExpense =
    relevantExpenses.length > 0 ? totalSpent / relevantExpenses.length : 0;

  const months = new Set(
    relevantExpenses.map((e) => e.date.slice(0, 7))
  );
  const avgPerMonth = months.size > 0 ? totalSpent / months.size : 0;

  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent.toFixed(2)),
      icon: DollarSign,
    },
    {
      label: "Total Expenses",
      value: relevantExpenses.length.toLocaleString(),
      icon: Receipt,
    },
    {
      label: "Avg per Expense",
      value: formatCurrency(avgExpense.toFixed(2)),
      icon: TrendingUp,
    },
    {
      label: "Avg per Month",
      value: formatCurrency(avgPerMonth.toFixed(2)),
      icon: Calendar,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
