"use server";

import { authActionClient } from "@/server/lib/action-client";
import { createExpenseSchema } from "@/schemas/expense";
import { sw } from "@/lib/splitwise";
import { revalidatePath, revalidateTag } from "next/cache";

export const createExpense = authActionClient
  .schema(createExpenseSchema)
  .action(async ({ parsedInput }) => {
    const response = await sw.createExpense({
      cost: parsedInput.amount,
      description: parsedInput.description,
      group_id: parsedInput.group_id,
      currency_code: parsedInput.currency_code,
      users: parsedInput.users,
    });

    if (response?.errors) {
      throw new Error(
        response.errors.base?.[0] ?? "Failed to create expense"
      );
    }

    revalidateTag("expenses");
    revalidateTag("groups");
    revalidatePath(`/group/${parsedInput.group_id}`);
    revalidatePath("/");

    return { success: "Expense created successfully." };
  });
