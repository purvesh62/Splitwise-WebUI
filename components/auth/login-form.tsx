"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAction } from "next-safe-action/hooks";
import { LoginSchema } from "@/schemas/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { FormError } from "@/components/auth/form-error";
import { emailSignIn } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { execute, isExecuting } = useAction(emailSignIn, {
    onSuccess(data) {
      if (data?.data?.error) setError(data.data.error);
    },
    onError() {
      setError("Something went wrong");
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    execute(values);
  };

  return (
    <AuthCard
      title="Welcome back!"
      backButtonHref="#"
      backButtonLabel="Create a new account"
      showSocialLogins={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />

          <Button
            type="submit"
            className={cn("w-full", isExecuting && "animate-pulse")}
            disabled={isExecuting}
          >
            {isExecuting ? "Signing in..." : "Login"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
