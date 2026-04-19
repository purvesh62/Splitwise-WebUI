"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Key,
  ExternalLink,
  CheckCircle2,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormError } from "@/components/auth/form-error";
import { setApiKeyCookie } from "@/server/actions/api-key";
import { useApiKey } from "@/hooks/use-api-key";
import { cn } from "@/lib/utils";

type OnboardingStep = {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
};

const steps: OnboardingStep[] = [
  {
    icon: ExternalLink,
    title: "Open the Splitwise dashboard",
    description: (
      <>
        Go to{" "}
        <a
          href="https://secure.splitwise.com/#/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Dashboard
        </a>{" "}
        and open your app settings.
      </>
    ),
  },
  {
    icon: Key,
    title: "Register your app",
    description: (
      <>
        Open{" "}
        <a
          href="https://secure.splitwise.com/apps/new"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Create App
        </a>{" "}
        and fill in: Application Name <span className="font-medium">&lt;any name you like&gt;</span>,
        Application Description, Homepage URL{" "}
        <span className="font-medium">http://localhost:3000</span>. Accept
        the service terms, click <span className="font-medium">Create API key</span>,
        then copy the API key.
      </>
    ),
  },
  {
    icon: Key,
    title: "Paste that in the UI",
    description:
      "Paste the generated API key below and we\u2019ll verify it by connecting to your Splitwise account.",
  },
  {
    icon: Zap,
    title: "Start using WiseSplit",
    description:
      "View your groups, expenses, analytics, and more \u2014 all in one place.",
  },
];

export function OnboardingForm() {
  const router = useRouter();
  const { setApiKey } = useApiKey();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setError("Please enter your API key.");
      setLoading(false);
      return;
    }

    const result = await setApiKeyCookie(trimmed);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setApiKey(trimmed);
    router.push("/");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Key className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Connect your Splitwise account</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Paste your Splitwise API key to get started.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Splitwise API Key</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="apiKey"
                type="password"
                placeholder="Paste your API key here"
                autoComplete="off"
                className="pl-10"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
            <Shield className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and in a secure
              server-side cookie. It is never saved to any database.
            </p>
          </div>

          <FormError message={error} />

          <Button
            type="submit"
            className={cn("w-full", loading && "animate-pulse")}
            disabled={loading}
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Connect &amp; Continue
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <a
          href="https://secure.splitwise.com/apps/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Create your Splitwise API key
        </a>
      </CardFooter>
    </Card>
  );
}
