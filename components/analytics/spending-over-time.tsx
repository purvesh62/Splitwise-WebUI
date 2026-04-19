"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format, parseISO, startOfMonth } from "date-fns";
import type { GroupExpense } from "@/types/splitwise";
import { type ViewMode, getExpenseAmount } from "./analytics-dashboard";

export function SpendingOverTime({
  expenses,
  viewMode,
  currentUserId,
}: {
  expenses: GroupExpense[];
  viewMode: ViewMode;
  currentUserId: number;
}) {
  const monthlyMap = new Map<string, number>();

  for (const expense of expenses) {
    const amount = getExpenseAmount(expense, viewMode, currentUserId);
    if (amount <= 0) continue;
    const month = format(startOfMonth(parseISO(expense.date)), "yyyy-MM");
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + amount);
  }

  const data = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({
      month: format(parseISO(`${month}-01`), "MMM yyyy"),
      total: parseFloat(total.toFixed(2)),
    }));

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spending Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No expense data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Spending Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Total Spending"]}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="hsl(142, 76%, 36%)"
              fill="url(#spendingGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
