import { unstable_cache } from "next/cache";
import { sw } from "@/lib/splitwise";
import type { SplitwiseUser } from "@/types/splitwise";

export const getCurrentUser = unstable_cache(
  async (): Promise<SplitwiseUser> => {
    try {
      return await sw.getCurrentUser();
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw new Error("Unable to load user.");
    }
  },
  ["current-user"],
  { tags: ["user"], revalidate: 600 }
);
