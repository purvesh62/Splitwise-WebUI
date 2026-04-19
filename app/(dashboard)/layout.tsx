import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { hasValidApiKey } from "@/server/actions/api-key";
import { getCurrentUser } from "@/server/queries/user";
import { getGroups } from "@/server/queries/groups";
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

  try {
    [user, groups] = await Promise.all([getCurrentUser(), getGroups()]);
  } catch {
    redirect("/onboarding");
  }

  return (
    <DashboardShell user={user} groups={groups}>
      {children}
    </DashboardShell>
  );
}
