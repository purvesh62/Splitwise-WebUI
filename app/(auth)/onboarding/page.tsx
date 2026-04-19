import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect Splitwise - WiseSplit",
};

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/sign-in");

  return <OnboardingForm />;
}
