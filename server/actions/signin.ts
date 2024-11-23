"use server"
import {LoginSchema} from "@/schema/login-schema"
import {createSafeActionClient} from "next-safe-action"
import {signIn} from "../auth"
import {AuthError} from "next-auth"
import {redirect} from "next/navigation";

const action = createSafeActionClient()

export const emailSignIn = action(
	LoginSchema,
	async ({email, password}) => {
		try {
			await signIn("credentials", {
				email,
				password,
				redirectTo: "/"
			});
			return redirect("/");
			// return {
			// 	success: "User Signed In!",
			// }
		} catch (error) {
			if (error instanceof AuthError) {
				switch (error.type) {
					case "CredentialsSignin":
						return {error: "Email or Password Incorrect"}
					case "AccessDenied":
						return {error: error.message}
					case "OAuthSignInError":
						return {error: error.message}
					default:
						if (error?.cause?.err?.message) {
							return {error: error?.cause?.err?.message}
						}
						return {error: "Something went wrong"}
				}
			}
			// return {
			// 	error: "Failed to sign in",
			// }
			return redirect("/");
		}
	})
// "use server"; // don't forget to add this!

// import { z } from "zod";

// import { createSafeActionClient } from "next-safe-action";

// export const actionClient = createSafeActionClient();

// // This schema is used to validate input from client.
// const schema = z.object({
//     email: z.string().min(3).max(10),
//     password: z.string().min(8).max(100),
// });

// export const emailSignIn = actionClient
//     .schema(schema)
//     .action(
//         async ({ parsedInput: { email, password } }) => {
//         if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
//             return {
//                 success: "Successfully logged in",
//             };
//         }

//         return { failure: "Incorrect credentials" };
//     });