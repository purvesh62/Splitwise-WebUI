"use server";

import { LoginSchema } from "@/schemas/auth";
import { actionClient } from "@/server/lib/action-client";
import { signIn } from "@/server/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Email or Password Incorrect" };
          case "AccessDenied":
            return { error: error.message };
          default:
            return { error: "Something went wrong" };
        }
      }
      throw error;
    }
    redirect("/");
  });
