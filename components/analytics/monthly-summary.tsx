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
  Legend,
} from "recharts";
import { format, parseISO, startOfMonth } from "date-fns";
import type { GroupExpense } from "@/types/splitwise";

export function MonthlySummary({
  expenses,
  currentUserId,
}: {
  expenses: GroupExpense[];
  currentUserId: number;
}) {
  const monthlyData = new Map<string, { paid: number; owed: number }>();

  for (const expense of expenses) {
    const month = format(startOfMonth(parseISO(expense.date)), "yyyy-MM");
    const entry = monthlyData.get(month) ?? { paid: 0, owed: 0 };

    const userEntry = expense.users.find((u) => u.user_id === currentUserId);
    if (userEntry) {
      entry.paid += parseFloat(userEntry.paid_share);
      entry.owed += parseFloat(userEntry.owed_share);
    }

    monthlyData.set(month, entry);
  }

  const data = Array.from(monthlyData.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([, v]) => v.paid > 0 || v.owed > 0)
    .map(([month, values]) => ({
      month: format(parseISO(`${month}-01`), "MMM yy"),
      paid: parseFloat(values.paid.toFixed(2)),
      owed: parseFloat(values.owed.toFixed(2)),
    }));

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Paid vs Owed</CardTitle>
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
        <CardTitle className="text-lg">Monthly Paid vs Owed (You)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number, name: string) => [
                `$${value.toFixed(2)}`,
                name === "paid" ? "You Paid" : "Your Share",
              ]}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-foreground">
                  {value === "paid" ? "You Paid" : "Your Share"}
                </span>
              )}
            />
            <Bar dataKey="paid" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="owed" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
