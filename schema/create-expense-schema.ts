import { z } from "zod";

export const createExpenseSchema = z.object({
    amount: z.string().min(1, {
        message: "Amount must be a positive number.",
    }),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    }),
    currency_code: z.string().min(1, {
        message: "Currency code must be at least 1 character.",
    }),
    users: z.array(z.object({
        user_id: z.number(),
        paid_share: z.string(),
        owed_share: z.string(),
    })),
    paid_by: z.array(z.string()),
    owed_by: z.array(z.string()),
    group_id: z.number(),
});
