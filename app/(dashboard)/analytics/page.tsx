import { getGroups, getAllExpenses } from "@/server/queries/groups";
import { getCurrentUser } from "@/server/queries/user";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics - WiseSplit",
};

export default async function AnalyticsPage() {
  const [groups, user] = await Promise.all([getGroups(), getCurrentUser()]);
  const groupIds = groups.map((g) => g.id);
  const expenses = await getAllExpenses(groupIds);

  return (
    <AnalyticsDashboard
      expenses={expenses}
      groups={groups}
      currentUserId={user.id}
    />
  );
}
