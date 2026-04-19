import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSplitwiseClient } from "@/lib/splitwise";

const COOKIE_NAME = "sw-api-key";

export async function getSw() {
  const apiKey = await getApiKey();
  return createSplitwiseClient(apiKey);
}

export async function getApiKey(): Promise<string> {
  const cookieStore = await cookies();
  const apiKey = cookieStore.get(COOKIE_NAME)?.value;
  if (!apiKey) {
    redirect("/onboarding");
  }
  return apiKey;
}
