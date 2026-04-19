import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { SplitwiseGroup } from "@/types/splitwise";

export function StatsCards({
  groups,
  currentUserId,
}: {
  groups: SplitwiseGroup[];
  currentUserId: number;
}) {
  let totalOwed = 0;
  let totalOwe = 0;

  for (const group of groups) {
    const me = group.members.find((m) => m.id === currentUserId);
    if (!me?.balance) continue;
    for (const b of me.balance) {
      const amount = parseFloat(b.amount);
      if (amount > 0) totalOwed += amount;
      else totalOwe += Math.abs(amount);
    }
  }

  const net = totalOwed - totalOwe;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Owed to You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-positive">
            {formatCurrency(totalOwed)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total You Owe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-negative">
            {formatCurrency(totalOwe)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Net Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-semibold ${
              net >= 0 ? "text-positive" : "text-negative"
            }`}
          >
            {net >= 0 ? "+" : "-"}
            {formatCurrency(Math.abs(net))}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
