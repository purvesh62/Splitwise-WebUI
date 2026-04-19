"use server";

import { auth } from "@/lib/auth/server";
import { createExpenseSchema } from "@/schemas/expense";
import { getSw } from "@/server/lib/get-sw";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createExpense(input: unknown) {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = createExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const sw = await getSw();
  const response = await sw.createExpense({
    cost: parsed.data.amount,
    description: parsed.data.description,
    group_id: parsed.data.group_id,
    currency_code: parsed.data.currency_code,
    users: parsed.data.users,
  });

  if (response?.errors) {
    return {
      error: response.errors.base?.[0] ?? "Failed to create expense",
    };
  }

  revalidateTag("expenses", "max");
  revalidateTag("groups", "max");
  revalidatePath(`/group/${parsed.data.group_id}`);
  revalidatePath("/");

  return { success: "Expense created successfully." };
}
