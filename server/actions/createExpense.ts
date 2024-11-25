"use server"
import {createExpenseSchema} from "@/schema/create-expense-schema";
import {createSafeActionClient} from "next-safe-action"

const Splitwise = require("splitwise");

const action = createSafeActionClient()

export const createExpense = action(
	createExpenseSchema,
	async ({amount, description, group_id, currency_code, users, paid_by, owed_by}) => {
		const sw = Splitwise({
			consumerKey: process.env.consumerKey,
			consumerSecret: process.env.consumerSecret,
		});
		debugger
		console.log(amount, description, group_id, currency_code, users);
		const response = sw
			.createExpense({
				cost: amount,
				description: description,
				group_id: group_id,
				currency_code: currency_code,
				users: users
			})
			.then((res: SplitwiseUser) => {
				return res;
			})
			.catch((error: Error) => {
				console.log(error);
				return {
					error: "Something went wrong",
				}
			});
		return {
			success: "Created expense successfully.",
		}
		
	}
)
