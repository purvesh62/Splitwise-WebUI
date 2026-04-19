"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatFullDate } from "@/lib/format";
import { getCategoryColor } from "@/lib/constants";
import { TbCategoryPlus } from "react-icons/tb";
import { ExpenseDetailSheet } from "@/components/expenses/expense-detail-sheet";
import type { GroupExpense, SplitwiseGroup } from "@/types/splitwise";
import { type ViewMode, getExpenseAmount } from "./analytics-dashboard";

export function TopExpenses({
  expenses,
  groups,
  viewMode,
  currentUserId,
}: {
  expenses: GroupExpense[];
  groups: SplitwiseGroup[];
  viewMode: ViewMode;
  currentUserId: number;
}) {
  const [selectedExpense, setSelectedExpense] =
    React.useState<GroupExpense | null>(null);

  const groupMap = new Map<number, string>();
  for (const g of groups) groupMap.set(g.id, g.name);

  const sorted = [...expenses]
    .map((e) => ({
      expense: e,
      amount: getExpenseAmount(e, viewMode, currentUserId),
    }))
    .filter(({ amount }) => amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  if (sorted.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-lg">Top Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No expenses found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-lg">
            Top 10 Expenses
            {viewMode === "my-share" && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                (your share)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {sorted.map(({ expense, amount }) => {
              const payer = expense.users.find(
                (u) => parseFloat(u.paid_share) > 0
              );
              return (
                <button
                  key={expense.id}
                  onClick={() => setSelectedExpense(expense)}
                  className="flex w-full items-center gap-4 py-3 text-left transition-colors hover:bg-muted/50 rounded-md px-2 -mx-2"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${getCategoryColor(
                      expense.category.id
                    )}`}
                  >
                    <TbCategoryPlus className="h-4 w-4" />
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {expense.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {groupMap.get(expense.group_id) ?? "Unknown"} &middot;{" "}
                      {formatFullDate(expense.date)}
                      {payer && ` \u00B7 ${payer.user?.first_name} paid`}
                    </p>
                  </div>

                  <p className="text-sm font-semibold">
                    {formatCurrency(amount.toFixed(2), expense.currency_code)}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ExpenseDetailSheet
        expense={selectedExpense}
        open={!!selectedExpense}
        onOpenChange={(open) => {
          if (!open) setSelectedExpense(null);
        }}
      />
    </>
  );
}
