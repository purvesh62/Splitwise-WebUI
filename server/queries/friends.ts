import { unstable_cache } from "next/cache";
import { sw } from "@/lib/splitwise";
import type { SplitwiseFriend } from "@/types/splitwise";

export const getFriends = unstable_cache(
  async (): Promise<SplitwiseFriend[]> => {
    try {
      return await sw.getFriends();
    } catch (error) {
      console.error("Failed to fetch friends:", error);
      throw new Error("Unable to load friends.");
    }
  },
  ["friends"],
  { tags: ["friends"], revalidate: 600 }
);

export async function getFriend(friendId: number): Promise<SplitwiseFriend | undefined> {
  try {
    const friends = await getFriends();
    return friends.find((f) => f.id === friendId);
  } catch (error) {
    console.error("Failed to fetch friend:", error);
    throw new Error("Unable to load friend.");
  }
}
