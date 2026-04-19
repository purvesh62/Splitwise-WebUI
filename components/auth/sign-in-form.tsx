"use client";

import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth/client";
import { AuthCard } from "@/components/auth/auth-card";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await authClient.signIn.email({
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        });

        if (result?.error) {
          setError(result.error.message || "Failed to sign in. Try again");
          return;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to sign in.");
        return;
      }

      window.location.assign("/");
    });
  }

  return (
    <AuthCard
      title="Welcome back"
      backButtonHref="/sign-up"
      backButtonLabel="Don't have an account? Sign up"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="********"
            autoComplete="current-password"
            required
          />
        </div>

        <FormError message={error} />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthCard>
  );
}
