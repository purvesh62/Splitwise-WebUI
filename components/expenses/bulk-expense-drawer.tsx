"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  Layers,
  Plus,
  RotateCw,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createExpense } from "@/server/actions/expenses";
import type { SplitwiseGroup, SplitwiseUser } from "@/types/splitwise";

type RowStatus = "idle" | "processing" | "success" | "error";

type BulkRow = {
  id: string;
  description: string;
  cost: string;
  paidBy: number | null;
  sharedWith: number[];
  status: RowStatus;
  error?: string;
};

function emptyRow(defaultPaidBy: number | null, defaultShared: number[]): BulkRow {
  return {
    id: crypto.randomUUID(),
    description: "",
    cost: "",
    paidBy: defaultPaidBy,
    sharedWith: defaultShared,
    status: "idle",
  };
}

function buildPayload(
  row: BulkRow,
  group: SplitwiseGroup,
  currency: string
): Parameters<typeof createExpense>[0] | null {
  if (row.paidBy == null) return null;
  const cost = parseFloat(row.cost);
  if (!row.description.trim() || Number.isNaN(cost) || cost <= 0) return null;
  if (row.sharedWith.length === 0) return null;

  const totalCost = parseFloat(cost.toFixed(2));
  const isPayerShared = row.sharedWith.includes(row.paidBy);
  const participantIds = isPayerShared
    ? [...row.sharedWith]
    : [...row.sharedWith, row.paidBy];
  const equalShare = parseFloat((totalCost / participantIds.length).toFixed(2));

  const users = participantIds.map((id) => ({
    user_id: id,
    paid_share: (id === row.paidBy ? totalCost : 0).toString(),
    owed_share: equalShare.toString(),
  }));

  const totalOwed = equalShare * participantIds.length;
  if (totalCost > totalOwed) {
    const diff = parseFloat((totalCost - totalOwed).toFixed(2));
    users[0].owed_share = (
      parseFloat(users[0].owed_share) + diff
    ).toString();
  }

  return {
    amount: totalCost.toFixed(2),
    description: row.description.trim(),
    group_id: group.id,
    currency_code: currency,
    users,
    paid_by: [],
    owed_by: [],
  };
}

function memberLabel(m: SplitwiseUser): string {
  return [m.first_name, m.last_name].filter(Boolean).join(" ") || m.email;
}

function SharedWithPicker({
  members,
  value,
  onChange,
  disabled,
}: {
  members: SplitwiseUser[];
  value: number[];
  onChange: (next: number[]) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  const toggle = (id: number) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  };

  const label =
    value.length === 0
      ? "Select"
      : value.length === members.length
      ? "Everyone"
      : `${value.length} selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{label}</span>
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        <div className="flex items-center justify-between px-2 py-1.5">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onChange(members.map((m) => m.id))}
          >
            Select all
          </button>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onChange([])}
          >
            Clear
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {members.map((m) => {
            const checked = value.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggle(m.id)}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
              >
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border",
                    checked
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-input"
                  )}
                >
                  {checked && <Check className="h-3 w-3" />}
                </div>
                <span className="truncate">{memberLabel(m)}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function StatusCell({
  status,
  error,
  onRetry,
}: {
  status: RowStatus;
  error?: string;
  onRetry: () => void;
}) {
  if (status === "processing") {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <RotateCw className="h-3.5 w-3.5 animate-spin" />
        Saving…
      </div>
    );
  }
  if (status === "success") {
    return (
      <div
        className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/15 text-green-600"
        title="Created"
      >
        <Check className="h-3.5 w-3.5" />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex items-center gap-1">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15 text-red-600"
          title={error ?? "Failed"}
        >
          <X className="h-3.5 w-3.5" />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={onRetry}
        >
          Retry
        </Button>
      </div>
    );
  }
  return <span className="text-xs text-muted-foreground">—</span>;
}

export function BulkExpenseDrawer({
  userGroup,
}: {
  userGroup: SplitwiseGroup;
}) {
  const [open, setOpen] = React.useState(false);
  const [currency, setCurrency] = React.useState("CAD");
  const [rows, setRows] = React.useState<BulkRow[]>(() => []);
  const [isRunning, setIsRunning] = React.useState(false);

  const allMemberIds = React.useMemo(
    () => userGroup.members.map((m) => m.id),
    [userGroup.members]
  );

  const ensureInitialRows = React.useCallback(() => {
    if (rows.length === 0) {
      setRows([emptyRow(null, allMemberIds), emptyRow(null, allMemberIds)]);
    }
  }, [rows.length, allMemberIds]);

  React.useEffect(() => {
    if (open) ensureInitialRows();
  }, [open, ensureInitialRows]);

  const updateRow = (id: string, patch: Partial<BulkRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, emptyRow(null, allMemberIds)]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const resetAll = () => {
    setRows([emptyRow(null, allMemberIds), emptyRow(null, allMemberIds)]);
  };

  const processRow = async (row: BulkRow) => {
    const payload = buildPayload(row, userGroup, currency);
    if (!payload) {
      updateRow(row.id, {
        status: "error",
        error: "Fill all fields: description, cost > 0, paid by, shared with.",
      });
      return;
    }
    updateRow(row.id, { status: "processing", error: undefined });
    try {
      const result = await createExpense(payload);
      if (result?.error) {
        updateRow(row.id, { status: "error", error: result.error });
      } else {
        updateRow(row.id, { status: "success", error: undefined });
      }
    } catch (err) {
      updateRow(row.id, {
        status: "error",
        error: err instanceof Error ? err.message : "Failed to create",
      });
    }
  };

  const runBulk = async () => {
    if (userGroup.id === 0) return;
    setIsRunning(true);
    const pending = rows.filter(
      (r) => r.status !== "success" && (r.description || r.cost)
    );
    for (const row of pending) {
      // Read latest row reference each time for retries to see updates
      await processRow(row);
    }
    setIsRunning(false);
  };

  const retryRow = async (id: string) => {
    const current = rows.find((r) => r.id === id);
    if (!current) return;
    await processRow(current);
  };

  const successCount = rows.filter((r) => r.status === "success").length;
  const errorCount = rows.filter((r) => r.status === "error").length;

  const canRun = !isRunning && rows.some((r) => r.status !== "success");
  const disableEdit = isRunning;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && isRunning) return;
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Layers className="mr-1 h-4 w-4" />
          Bulk Add
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Bulk add expenses</DialogTitle>
          <DialogDescription>
            Add multiple expenses at once to {userGroup.name}. Rows are processed
            in order; failures don&apos;t block the rest.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Currency</label>
            <Select
              value={currency}
              onValueChange={setCurrency}
              disabled={disableEdit}
            >
              <SelectTrigger className="h-8 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["CAD", "USD", "EUR", "GBP", "INR"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground">
            {successCount > 0 && (
              <span className="text-positive mr-3">
                {successCount} created
              </span>
            )}
            {errorCount > 0 && (
              <span className="text-negative">{errorCount} failed</span>
            )}
          </div>
        </div>

        <div className="overflow-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-2 text-left font-medium">Description</th>
                <th className="p-2 text-left font-medium w-[120px]">Cost</th>
                <th className="p-2 text-left font-medium w-[180px]">Paid by</th>
                <th className="p-2 text-left font-medium w-[180px]">Shared with</th>
                <th className="p-2 text-left font-medium w-[140px]">Status</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t",
                    row.status === "success" && "bg-green-500/5",
                    row.status === "error" && "bg-red-500/5"
                  )}
                >
                  <td className="p-2 align-top">
                    <Input
                      placeholder="Dinner, groceries…"
                      value={row.description}
                      disabled={disableEdit || row.status === "success"}
                      onChange={(e) =>
                        updateRow(row.id, { description: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-2 align-top">
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      placeholder="0.00"
                      value={row.cost}
                      disabled={disableEdit || row.status === "success"}
                      onChange={(e) =>
                        updateRow(row.id, { cost: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-2 align-top">
                    <Select
                      value={row.paidBy != null ? String(row.paidBy) : ""}
                      onValueChange={(v) =>
                        updateRow(row.id, { paidBy: Number(v) })
                      }
                      disabled={disableEdit || row.status === "success"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Who paid?" />
                      </SelectTrigger>
                      <SelectContent>
                        {userGroup.members.map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {memberLabel(m)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2 align-top">
                    <SharedWithPicker
                      members={userGroup.members}
                      value={row.sharedWith}
                      disabled={disableEdit || row.status === "success"}
                      onChange={(next) =>
                        updateRow(row.id, { sharedWith: next })
                      }
                    />
                    {row.status === "error" && row.error && (
                      <p className="mt-1 text-[11px] leading-tight text-negative">
                        {row.error}
                      </p>
                    )}
                  </td>
                  <td className="p-2 align-top">
                    <StatusCell
                      status={row.status}
                      error={row.error}
                      onRetry={() => retryRow(row.id)}
                    />
                  </td>
                  <td className="p-2 align-top">
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                      onClick={() => removeRow(row.id)}
                      disabled={disableEdit || rows.length === 1}
                      aria-label="Remove row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            disabled={disableEdit}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add row
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetAll}
              disabled={disableEdit}
            >
              Reset
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isRunning}
          >
            Close
          </Button>
          <Button onClick={runBulk} disabled={!canRun || userGroup.id === 0}>
            {isRunning ? "Creating…" : "Create all"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
