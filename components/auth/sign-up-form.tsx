"use client";

import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth/client";
import { AuthCard } from "@/components/auth/auth-card";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUpForm() {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");

    startTransition(async () => {
      try {
        const result = await authClient.signUp.email({
          email: formData.get("email") as string,
          name: formData.get("name") as string,
          password: formData.get("password") as string,
        });

        if (result?.error) {
          setError(result.error.message || "Failed to create account");
          return;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create account.");
        return;
      }

      window.location.assign("/onboarding");
    });
  }

  return (
    <AuthCard
      title="Create your account"
      backButtonHref="/sign-in"
      backButtonLabel="Already have an account? Sign in"
    >
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </div>

        <FormError message={error} />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthCard>
  );
}
