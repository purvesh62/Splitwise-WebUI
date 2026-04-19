import { createNeonAuth } from "@neondatabase/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

if (!baseUrl || !cookieSecret) {
  console.warn(
    "Missing NEON_AUTH_BASE_URL or NEON_AUTH_COOKIE_SECRET — auth will not work until configured."
  );
}

export const auth = createNeonAuth({
  baseUrl: baseUrl || "https://placeholder.neonauth.example.com",
  cookies: {
    secret: cookieSecret || "placeholder-secret-at-least-32-chars-long!",
  },
});
