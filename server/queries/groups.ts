import { unstable_cache } from "next/cache";
import { sw } from "@/lib/splitwise";
import type { SplitwiseGroup, GroupExpense } from "@/types/splitwise";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export const getGroups = unstable_cache(
  async (): Promise<SplitwiseGroup[]> => {
    try {
      return await sw.getGroups();
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      throw new Error("Unable to load groups.");
    }
  },
  ["groups"],
  { tags: ["groups"], revalidate: 300 }
);

export const getGroup = unstable_cache(
  async (groupId: number): Promise<SplitwiseGroup> => {
    try {
      return await sw.getGroup({ id: groupId });
    } catch (error) {
      console.error("Failed to fetch group:", error);
      throw new Error("Unable to load group.");
    }
  },
  ["group"],
  { tags: ["groups"], revalidate: 300 }
);

export const getGroupExpenses = unstable_cache(
  async (
    groupId: number,
    options: { limit?: number; offset?: number } = {}
  ): Promise<{ expenses: GroupExpense[]; hasMore: boolean }> => {
    const { limit = DEFAULT_PAGE_SIZE, offset = 0 } = options;
    try {
      const expenses: GroupExpense[] = await sw.getExpenses({
        group_id: groupId,
        limit: limit + 1,
        offset,
      });
      return {
        expenses: expenses.slice(0, limit),
        hasMore: expenses.length > limit,
      };
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      throw new Error("Unable to load expenses.");
    }
  },
  ["group-expenses"],
  { tags: ["expenses"], revalidate: 300 }
);

export async function getExpense(expenseId: number): Promise<GroupExpense> {
  try {
    return await sw.getExpense({ id: expenseId });
  } catch (error) {
    console.error("Failed to fetch expense:", error);
    throw new Error("Unable to load expense.");
  }
}
