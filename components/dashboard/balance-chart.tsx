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

export function BalanceChart({ groups }: { groups: SplitwiseGroup[] }) {
  const data = groups
    .filter((g) => g.id !== 0)
    .map((group) => {
      let balance = 0;
      for (const member of group.members) {
        for (const b of member.balance) {
          balance += parseFloat(b.amount);
        }
      }
      return {
        name: group.name.length > 12 ? group.name.slice(0, 12) + "..." : group.name,
        balance: parseFloat(balance.toFixed(2)),
      };
    })
    .filter((d) => d.balance !== 0);

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Balances by Group</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number) => [
                `$${Math.abs(value).toFixed(2)}`,
                value >= 0 ? "Owed to you" : "You owe",
              ]}
            />
            <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.balance >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
