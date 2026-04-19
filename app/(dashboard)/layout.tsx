import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { getCurrentUser } from "@/server/queries/user";
import { getGroups } from "@/server/queries/groups";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const [user, groups] = await Promise.all([
    getCurrentUser(),
    getGroups(),
  ]);

  return (
    <DashboardShell user={user} groups={groups}>
      {children}
    </DashboardShell>
  );
}
