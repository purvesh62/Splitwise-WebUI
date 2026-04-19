"use server";

import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/server/auth";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.error("Action error:", error.message);
    return error.message;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return next({ ctx: { session } });
});
