import { z } from "zod";

const expenseUserSchema = z.object({
  user_id: z.number(),
  paid_share: z.string(),
  owed_share: z.string(),
});

export const createExpenseSchema = z.object({
  amount: z.string().min(1, { message: "Amount is required." }),
  description: z.string().min(2, { message: "Description must be at least 2 characters." }),
  currency_code: z.string().min(1, { message: "Currency code is required." }),
  users: z.array(expenseUserSchema),
  paid_by: z.array(z.string()),
  owed_by: z.array(z.string()),
  group_id: z.number(),
});

export const updateExpenseSchema = createExpenseSchema.extend({
  id: z.number(),
});
