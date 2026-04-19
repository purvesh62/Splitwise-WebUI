"use server";

import { cookies } from "next/headers";
import { createSplitwiseClient } from "@/lib/splitwise";

const COOKIE_NAME = "sw-api-key";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function setApiKeyCookie(apiKey: string) {
  const sw = createSplitwiseClient(apiKey);

  try {
    const user = await sw.getCurrentUser();
    if (!user?.id) {
      return { error: "Invalid API key — could not verify with Splitwise." };
    }
  } catch {
    return { error: "Invalid API key — could not connect to Splitwise." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, apiKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });

  return { success: true };
}

export async function clearApiKeyCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}

export async function hasValidApiKey(): Promise<boolean> {
  const cookieStore = await cookies();
  const key = cookieStore.get(COOKIE_NAME)?.value;
  return !!key && key.length > 0;
}
