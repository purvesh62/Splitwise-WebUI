"use client";

import * as React from "react";
import { Check, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createGroup } from "@/server/actions/groups";
import type { SplitwiseFriend } from "@/types/splitwise";

function friendName(f: SplitwiseFriend): string {
  return [f.first_name, f.last_name].filter(Boolean).join(" ") || f.email;
}

function friendInitials(f: SplitwiseFriend): string {
  const first = f.first_name?.[0] ?? "";
  const last = f.last_name?.[0] ?? "";
  return (first + last).toUpperCase() || f.email.slice(0, 2).toUpperCase();
}

export function CreateGroupDialog({
  friends,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  friends: SplitwiseFriend[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const [name, setName] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());
  const [emailInput, setEmailInput] = React.useState("");
  const [emailInvites, setEmailInvites] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const reset = React.useCallback(() => {
    setName("");
    setSelectedIds(new Set());
    setEmailInput("");
    setEmailInvites([]);
    setSearch("");
    setError("");
  }, []);

  const filteredFriends = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter(
      (f) =>
        friendName(f).toLowerCase().includes(term) ||
        f.email.toLowerCase().includes(term)
    );
  }, [friends, search]);

  const toggleFriend = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addEmail = () => {
    const value = emailInput.trim();
    if (!value) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email.");
      return;
    }
    if (emailInvites.includes(value)) {
      setEmailInput("");
      return;
    }
    setEmailInvites((prev) => [...prev, value]);
    setEmailInput("");
    setError("");
  };

  const removeEmail = (email: string) => {
    setEmailInvites((prev) => prev.filter((e) => e !== email));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name is required.");
      return;
    }
    setError("");
    setSubmitting(true);

    const members: {
      user_id?: number;
      email?: string;
    }[] = [];

    for (const id of selectedIds) {
      members.push({ user_id: id });
    }
    for (const email of emailInvites) {
      members.push({ email });
    }

    let result: Awaited<ReturnType<typeof createGroup>> | undefined;
    try {
      result = await createGroup({ name: name.trim(), members });
    } catch (err) {
      console.error("[create-group] client error:", err);
      setSubmitting(false);
      setError(
        err instanceof Error ? err.message : "Failed to create group."
      );
      return;
    }

    setSubmitting(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    reset();
    setOpen(false);

    if (result?.groupId) {
      router.push(`/group/${result.groupId}`);
    } else {
      router.refresh();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && submitting) return;
        setOpen(next);
        if (!next) reset();
      }}
    >
      {trigger}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a group</DialogTitle>
          <DialogDescription>
            Add members from your friends or invite by email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group name</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Roommates, Trip to Spain"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Invite by email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={emailInput}
                placeholder="friend@example.com"
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addEmail();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addEmail}>
                Add
              </Button>
            </div>
            {emailInvites.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {emailInvites.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${email}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Add friends</Label>
              {selectedIds.size > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear ({selectedIds.size})
                </button>
              )}
            </div>
            <Input
              placeholder="Search friends…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="max-h-56 overflow-y-auto rounded-md border">
              {filteredFriends.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">
                  No friends found.
                </p>
              ) : (
                filteredFriends.map((friend) => {
                  const checked = selectedIds.has(friend.id);
                  return (
                    <button
                      key={friend.id}
                      type="button"
                      onClick={() => toggleFriend(friend.id)}
                      className="flex w-full items-center gap-3 border-b px-3 py-2 text-left text-sm last:border-b-0 hover:bg-accent"
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          checked
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-input"
                        )}
                      >
                        {checked && <Check className="h-3 w-3" />}
                      </div>
                      <Avatar className="h-7 w-7 shrink-0">
                        {friend.picture?.medium && (
                          <AvatarImage src={friend.picture.medium} />
                        )}
                        <AvatarFallback className="text-[10px]">
                          {friendInitials(friend)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {friendName(friend)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {friend.email}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-negative">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                "Creating…"
              ) : (
                <>
                  <Plus className="mr-1 h-4 w-4" />
                  Create group
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
