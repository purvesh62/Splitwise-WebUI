import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { hasValidApiKey } from "@/server/actions/api-key";
import { getCurrentUser } from "@/server/queries/user";
import { getGroups } from "@/server/queries/groups";
import { getFriends } from "@/server/queries/friends";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const hasKey = await hasValidApiKey();
  if (!hasKey) redirect("/onboarding");

  let user;
  let groups;
  let friends;

  try {
    [user, groups, friends] = await Promise.all([
      getCurrentUser(),
      getGroups(),
      getFriends().catch(() => []),
    ]);
  } catch {
    redirect("/onboarding");
  }

  return (
    <DashboardShell user={user} groups={groups} friends={friends}>
      {children}
    </DashboardShell>
  );
}
