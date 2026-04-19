import { unstable_cache } from "next/cache";
import { createSplitwiseClient } from "@/lib/splitwise";
import { getApiKey } from "@/server/lib/get-sw";
import type { SplitwiseFriend } from "@/types/splitwise";

export async function getFriends(): Promise<SplitwiseFriend[]> {
  const apiKey = await getApiKey();
  return unstable_cache(
    async (): Promise<SplitwiseFriend[]> => {
      try {
        const sw = createSplitwiseClient(apiKey);
        return await sw.getFriends();
      } catch (error) {
        console.error("Failed to fetch friends:", error);
        throw new Error("Unable to load friends.");
      }
    },
    ["friends", apiKey.slice(-8)],
    { tags: ["friends"], revalidate: 600 }
  )();
}

export async function getFriend(
  friendId: number
): Promise<SplitwiseFriend | undefined> {
  const friends = await getFriends();
  return friends.find((f) => f.id === friendId);
}
