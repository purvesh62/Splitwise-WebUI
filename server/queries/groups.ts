import { unstable_cache } from "next/cache";
import { createSplitwiseClient } from "@/lib/splitwise";
import { getApiKey } from "@/server/lib/get-sw";
import type { SplitwiseGroup, GroupExpense } from "@/types/splitwise";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export async function getGroups(): Promise<SplitwiseGroup[]> {
  const apiKey = await getApiKey();
  return unstable_cache(
    async (): Promise<SplitwiseGroup[]> => {
      try {
        const sw = createSplitwiseClient(apiKey);
        return await sw.getGroups();
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        throw new Error("Unable to load groups.");
      }
    },
    ["groups", apiKey.slice(-8)],
    { tags: ["groups"], revalidate: 300 }
  )();
}

export async function getGroup(groupId: number): Promise<SplitwiseGroup> {
  const apiKey = await getApiKey();
  return unstable_cache(
    async (): Promise<SplitwiseGroup> => {
      try {
        const sw = createSplitwiseClient(apiKey);
        return await sw.getGroup({ id: groupId });
      } catch (error) {
        console.error("Failed to fetch group:", error);
        throw new Error("Unable to load group.");
      }
    },
    ["group", String(groupId), apiKey.slice(-8)],
    { tags: ["groups"], revalidate: 300 }
  )();
}

export async function getGroupExpenses(
  groupId: number,
  options: { limit?: number; offset?: number } = {}
): Promise<{ expenses: GroupExpense[]; hasMore: boolean }> {
  const { limit = DEFAULT_PAGE_SIZE, offset = 0 } = options;
  const apiKey = await getApiKey();
  return unstable_cache(
    async (): Promise<{ expenses: GroupExpense[]; hasMore: boolean }> => {
      try {
        const sw = createSplitwiseClient(apiKey);
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
    ["group-expenses", String(groupId), String(limit), String(offset), apiKey.slice(-8)],
    { tags: ["expenses"], revalidate: 300 }
  )();
}

export async function getExpense(expenseId: number): Promise<GroupExpense> {
  const apiKey = await getApiKey();
  const sw = createSplitwiseClient(apiKey);
  try {
    return await sw.getExpense({ id: expenseId });
  } catch (error) {
    console.error("Failed to fetch expense:", error);
    throw new Error("Unable to load expense.");
  }
}

export async function getAllExpenses(
  groupIds: number[],
  options: { datedAfter?: string; datedBefore?: string } = {}
): Promise<GroupExpense[]> {
  const apiKey = await getApiKey();
  return unstable_cache(
    async (): Promise<GroupExpense[]> => {
      const sw = createSplitwiseClient(apiKey);
      const allExpenses: GroupExpense[] = [];
      for (const groupId of groupIds) {
        if (groupId === 0) continue;
        try {
          const expenses: GroupExpense[] = await sw.getExpenses({
            group_id: groupId,
            limit: 0,
            ...(options.datedAfter && { dated_after: options.datedAfter }),
            ...(options.datedBefore && { dated_before: options.datedBefore }),
          });
          allExpenses.push(
            ...expenses.filter((e) => !e.deleted_at && !e.payment)
          );
        } catch {
          // skip groups that fail
        }
      }
      return allExpenses.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
    ["all-expenses", ...groupIds.map(String), apiKey.slice(-8)],
    { tags: ["expenses"], revalidate: 300 }
  )();
}
