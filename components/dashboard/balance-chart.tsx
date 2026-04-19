"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SplitwiseGroup } from "@/types/splitwise";

const COLOR_OWED = "hsl(142, 76%, 36%)";
const COLOR_OWE = "hsl(0, 84%, 60%)";

export function BalanceChart({
  groups,
  currentUserId,
}: {
  groups: SplitwiseGroup[];
  currentUserId: number;
}) {
  const data = groups
    .filter((g) => g.id !== 0)
    .map((group) => {
      const me = group.members.find((m) => m.id === currentUserId);
      let balance = 0;
      if (me?.balance) {
        for (const b of me.balance) {
          balance += parseFloat(b.amount);
        }
      }
      const rawBalance = parseFloat(balance.toFixed(2));
      return {
        name:
          group.name.length > 12 ? group.name.slice(0, 12) + "..." : group.name,
        fullName: group.name,
        amount: Math.abs(rawBalance),
        type: rawBalance >= 0 ? "owed" : "owe",
      };
    })
    .filter((d) => d.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Balances by Group</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">All groups settled up.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Balances by Group</CardTitle>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: COLOR_OWED }}
            />
            Owed to you
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: COLOR_OWE }}
            />
            You owe
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 5, bottom: 5, left: 5 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, "auto"]}
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
              formatter={((value: number, _name: string, entry: { payload?: { type?: string } }) => [
                `$${value.toFixed(2)}`,
                entry?.payload?.type === "owed" ? "Owed to you" : "You owe",
              ]) as never}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.fullName ?? ""
              }
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.type === "owed" ? COLOR_OWED : COLOR_OWE}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
