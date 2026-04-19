"use client";

import * as React from "react";
import { formatDate, formatCurrency } from "@/lib/format";
import { getCategoryColor } from "@/lib/constants";
import { TbCategoryPlus } from "react-icons/tb";
import { ExpenseDetailSheet } from "@/components/expenses/expense-detail-sheet";
import type { GroupExpense } from "@/types/splitwise";

export function ExpenseList({ expenses }: { expenses: GroupExpense[] }) {
  const [selectedExpense, setSelectedExpense] =
    React.useState<GroupExpense | null>(null);

  if (expenses.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No expenses yet.
      </p>
    );
  }

  return (
    <>
      <div className="divide-y">
        {expenses.map((expense) => {
          const { month, day } = formatDate(expense.created_at);
          const payer = expense.users.find(
            (u) => parseFloat(u.paid_share) > 0
          );

          return (
            <button
              key={expense.id}
              type="button"
              onClick={() => setSelectedExpense(expense)}
              className="flex w-full items-center gap-4 py-3 text-left transition-colors hover:bg-muted/50 rounded-md px-2 -mx-2"
            >
              <div className="flex w-10 flex-col items-center text-muted-foreground">
                <span className="text-[10px] uppercase">{month}</span>
                <span className="text-lg font-semibold leading-none">
                  {day}
                </span>
              </div>

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
                {payer && (
                  <p className="text-xs text-muted-foreground">
                    {payer.user?.first_name} paid
                  </p>
                )}
              </div>

              <p className="text-sm font-semibold text-positive">
                {formatCurrency(expense.cost, expense.currency_code)}
              </p>
            </button>
          );
        })}
      </div>

      <ExpenseDetailSheet
        expense={selectedExpense}
        open={selectedExpense !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedExpense(null);
        }}
      />
    </>
  );
}
