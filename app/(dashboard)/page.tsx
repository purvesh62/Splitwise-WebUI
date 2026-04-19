import { getGroups, getAllExpenses } from "@/server/queries/groups";
import { getFriends } from "@/server/queries/friends";
import { getCurrentUser } from "@/server/queries/user";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { BalanceChart } from "@/components/dashboard/balance-chart";
import { BalancesByPerson } from "@/components/dashboard/balances-by-person";

export default async function DashboardPage() {
  const [groups, friends, currentUser] = await Promise.all([
    getGroups(),
    getFriends(),
    getCurrentUser(),
  ]);

  const groupIds = groups.map((g) => g.id).filter((id) => id !== 0);
  const allExpenses = await getAllExpenses(groupIds).catch(() => []);
  const recentExpenses = allExpenses.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your expense summary at a glance.
        </p>
      </div>

      <StatsCards groups={groups} currentUserId={currentUser.id} />

      <BalancesByPerson friends={friends} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentExpenses expenses={recentExpenses} />
        <BalanceChart groups={groups} currentUserId={currentUser.id} />
      </div>
    </div>
  );
}
