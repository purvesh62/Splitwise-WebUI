"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Key, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setApiKeyCookie, clearApiKeyCookie } from "@/server/actions/api-key";
import { useApiKey } from "@/hooks/use-api-key";
import { cn } from "@/lib/utils";

export function ApiKeySettings() {
  const router = useRouter();
  const { apiKey, setApiKey, clearApiKey } = useApiKey();
  const [newKey, setNewKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newKey.trim();
    if (!trimmed) return;

    setLoading(true);
    setMessage(null);

    const result = await setApiKeyCookie(trimmed);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
      setLoading(false);
      return;
    }

    setApiKey(trimmed);
    setNewKey("");
    setMessage({ type: "success", text: "API key updated successfully." });
    setLoading(false);
    router.refresh();
  }

  async function handleDisconnect() {
    clearApiKey();
    await clearApiKeyCookie();
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <Key className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Splitwise API Key</p>
            <p className="text-xs text-muted-foreground">
              {apiKey ? "Connected" : "Not connected"}
            </p>
          </div>
        </div>
        {apiKey && (
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        )}
      </div>

      <form onSubmit={handleUpdate} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="newApiKey" className="sr-only">
            New API Key
          </Label>
          <Input
            id="newApiKey"
            type="password"
            placeholder="Paste new API key to update"
            autoComplete="off"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={loading || !newKey.trim()}
          className={cn(loading && "animate-pulse")}
        >
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          {loading ? "Verifying..." : "Update"}
        </Button>
      </form>

      {message && (
        <p
          className={cn(
            "text-xs",
            message.type === "error"
              ? "text-destructive"
              : "text-green-600 dark:text-green-400"
          )}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
