import { unstable_cache } from "next/cache";
import { createSplitwiseClient } from "@/lib/splitwise";
import { getApiKey } from "@/server/lib/get-sw";
import type { SplitwiseUser } from "@/types/splitwise";

export async function getCurrentUser(): Promise<SplitwiseUser> {
  const apiKey = await getApiKey();
  return unstable_cache(
    async (): Promise<SplitwiseUser> => {
      try {
        const sw = createSplitwiseClient(apiKey);
        return await sw.getCurrentUser();
      } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Unable to load user.");
      }
    },
    ["current-user", apiKey.slice(-8)],
    { tags: ["user"], revalidate: 600 }
  )();
}
