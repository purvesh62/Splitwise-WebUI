import { SignInForm } from "@/components/auth/sign-in-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - WiseSplit",
};

export default function SignInPage() {
  return <SignInForm />;
}
