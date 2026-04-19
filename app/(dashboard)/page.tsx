import { getGroups, getGroupExpenses } from "@/server/queries/groups";
import { getFriends } from "@/server/queries/friends";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { BalanceChart } from "@/components/dashboard/balance-chart";
import type { GroupExpense } from "@/types/splitwise";

export default async function DashboardPage() {
  const [groups, friends] = await Promise.all([getGroups(), getFriends()]);

  const allExpenses: GroupExpense[] = [];
  for (const group of groups.slice(0, 5)) {
    if (group.id === 0) continue;
    try {
      const { expenses } = await getGroupExpenses(group.id, { limit: 5 });
      allExpenses.push(...expenses);
    } catch {
      // skip groups that fail to load
    }
  }

  const recentExpenses = allExpenses
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your expense summary at a glance.
        </p>
      </div>

      <StatsCards friends={friends} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentExpenses expenses={recentExpenses} />
        <BalanceChart groups={groups} />
      </div>
    </div>
  );
}
