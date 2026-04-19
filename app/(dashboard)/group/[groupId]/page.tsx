import { notFound } from "next/navigation";
import { getGroup, getGroupExpenses } from "@/server/queries/groups";
import { GroupHeader } from "@/components/groups/group-header";
import { GroupBalances } from "@/components/groups/group-balances";
import { ExpenseList } from "@/components/expenses/expense-list";
import { Pagination } from "@/components/expenses/pagination";
import { AddExpenseDrawer } from "@/components/expenses/add-expense-drawer";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  try {
    const group = await getGroup(Number(groupId));
    return { title: group.name };
  } catch {
    return { title: "Group" };
  }
}

export default async function GroupPage({
  params,
  searchParams,
}: {
  params: Promise<{ groupId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { groupId } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * DEFAULT_PAGE_SIZE;

  let group;
  try {
    group = await getGroup(Number(groupId));
  } catch {
    notFound();
  }

  const { expenses, hasMore } = await getGroupExpenses(Number(groupId), {
    offset,
    limit: DEFAULT_PAGE_SIZE,
  });

  return (
    <div className="flex h-full flex-col gap-6 lg:flex-row">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between pb-4">
          <GroupHeader group={group} />
          <AddExpenseDrawer userGroup={group} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <ExpenseList expenses={expenses} />
        </div>
        <div className="pt-4">
          <Pagination hasMore={hasMore} currentPage={currentPage} />
        </div>
      </div>

      <div className="w-full shrink-0 lg:w-72 lg:overflow-y-auto">
        <GroupBalances members={group.members} />
      </div>
    </div>
  );
}
