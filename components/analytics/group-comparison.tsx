"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { GroupExpense, SplitwiseGroup } from "@/types/splitwise";
import { type ViewMode, getExpenseAmount } from "./analytics-dashboard";

export function GroupComparison({
  expenses,
  groups,
  viewMode,
  currentUserId,
}: {
  expenses: GroupExpense[];
  groups: SplitwiseGroup[];
  viewMode: ViewMode;
  currentUserId: number;
}) {
  const groupMap = new Map<number, string>();
  for (const g of groups) {
    if (g.id !== 0) groupMap.set(g.id, g.name);
  }

  const spendMap = new Map<number, number>();
  for (const expense of expenses) {
    const amount = getExpenseAmount(expense, viewMode, currentUserId);
    if (amount <= 0) continue;
    spendMap.set(
      expense.group_id,
      (spendMap.get(expense.group_id) ?? 0) + amount
    );
  }

  const data = Array.from(spendMap.entries())
    .map(([groupId, total]) => ({
      name:
        (groupMap.get(groupId) ?? "Unknown").length > 14
          ? (groupMap.get(groupId) ?? "Unknown").slice(0, 14) + "..."
          : groupMap.get(groupId) ?? "Unknown",
      total: parseFloat(total.toFixed(2)),
    }))
    .sort((a, b) => b.total - a.total);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spending by Group</CardTitle>
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
        <CardTitle className="text-lg">Spending by Group</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Bar dataKey="total" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
