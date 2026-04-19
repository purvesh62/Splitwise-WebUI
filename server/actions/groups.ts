"use server";

import { z } from "zod";
import { auth } from "@/lib/auth/server";
import { getSw } from "@/server/lib/get-sw";
import { revalidatePath, revalidateTag } from "next/cache";

const createGroupSchema = z.object({
  name: z.string().trim().min(1, "Group name is required."),
  members: z.array(
    z.object({
      user_id: z.number().optional(),
      email: z.string().email().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
    })
  ),
});

export async function createGroup(
  input: unknown
): Promise<{ error?: string; success?: boolean; groupId?: number | null }> {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) return { error: "You are not signed in." };

    const parsed = createGroupSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const sw = await getSw();

    const args: Record<string, unknown> = {
      name: parsed.data.name,
    };
    if (parsed.data.members.length > 0) {
      args.users = parsed.data.members;
    }

    let response: { id?: number; errors?: Record<string, string[]> } | undefined;
    try {
      response = await sw.createGroup(args);
    } catch (err) {
      console.error("[createGroup] sw.createGroup threw:", err);
      const message =
        err instanceof Error ? err.message : String(err ?? "Unknown error");
      return { error: `Splitwise rejected the request: ${message}` };
    }

    if (response?.errors) {
      const message =
        response.errors.base?.[0] ??
        Object.values(response.errors).flat()[0] ??
        "Failed to create group";
      console.error("[createGroup] API errors:", response.errors);
      return { error: String(message) };
    }

    revalidateTag("groups", "max");
    revalidatePath("/");

    return { success: true, groupId: response?.id ?? null };
  } catch (err) {
    console.error("[createGroup] unexpected error:", err);
    return {
      error: err instanceof Error ? err.message : "Failed to create group",
    };
  }
}
