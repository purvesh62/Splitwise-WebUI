"use server";

import { auth } from "@/lib/auth/server";
import { createExpenseSchema } from "@/schemas/expense";
import { getSw } from "@/server/lib/get-sw";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

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

const deleteExpenseSchema = z.object({
  id: z.number().int().positive(),
  groupId: z.number().int().nonnegative().optional(),
});

export async function deleteExpense(
  input: unknown
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) return { error: "You are not signed in." };

    const parsed = deleteExpenseSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const sw = await getSw();
    let response: { errors?: Record<string, string[]> } | undefined;
    try {
      response = await sw.deleteExpense({ id: parsed.data.id });
    } catch (err) {
      console.error("[deleteExpense] sw.deleteExpense threw:", err);
      return {
        error: err instanceof Error ? err.message : "Failed to delete expense",
      };
    }

    if (response?.errors) {
      const message =
        response.errors.base?.[0] ??
        Object.values(response.errors).flat()[0] ??
        "Failed to delete expense";
      return { error: String(message) };
    }

    revalidateTag("expenses", "max");
    revalidateTag("groups", "max");
    if (parsed.data.groupId != null) {
      revalidatePath(`/group/${parsed.data.groupId}`, "page");
    }
    revalidatePath("/", "page");

    return { success: true };
  } catch (err) {
    console.error("[deleteExpense] unexpected error:", err);
    return {
      error: err instanceof Error ? err.message : "Failed to delete expense",
    };
  }
}
