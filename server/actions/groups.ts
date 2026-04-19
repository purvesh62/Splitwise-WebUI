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

export async function createGroup(input: unknown) {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = createGroupSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const sw = await getSw();
  try {
    const response = await sw.createGroup({
      name: parsed.data.name,
      users: parsed.data.members,
    });

    if (response?.errors) {
      const message =
        response.errors.base?.[0] ??
        Object.values(response.errors).flat()[0] ??
        "Failed to create group";
      return { error: String(message) };
    }

    revalidateTag("groups", "max");
    revalidatePath("/");

    return { success: true, groupId: response?.id ?? null };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create group",
    };
  }
}
