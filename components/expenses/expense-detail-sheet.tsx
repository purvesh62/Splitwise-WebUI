"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, formatFullDate } from "@/lib/format";
import { getCategoryColor } from "@/lib/constants";
import { TbCategoryPlus } from "react-icons/tb";
import type { GroupExpense } from "@/types/splitwise";

export function ExpenseDetailSheet({
  expense,
  open,
  onOpenChange,
}: {
  expense: GroupExpense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!expense) return null;

  const payer = expense.users.find((u) => parseFloat(u.paid_share) > 0);
  const owedUsers = expense.users.filter((u) => parseFloat(u.owed_share) > 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${getCategoryColor(
                expense.category.id
              )}`}
            >
              <TbCategoryPlus className="h-5 w-5" />
            </span>
            <div>
              <SheetTitle>{expense.description}</SheetTitle>
              <SheetDescription>
                {formatFullDate(expense.date)}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-bold">
              {formatCurrency(expense.cost, expense.currency_code)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Category</span>
            <Badge variant="secondary">{expense.category.name}</Badge>
          </div>

          <Separator />

          {payer && (
            <div>
              <p className="mb-3 text-sm font-medium">Paid by</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {payer.user?.picture?.medium && (
                    <AvatarImage src={payer.user.picture.medium} />
                  )}
                  <AvatarFallback className="text-xs">
                    {payer.user?.first_name?.[0]}
                    {payer.user?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {payer.user?.first_name} {payer.user?.last_name}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatCurrency(payer.paid_share, expense.currency_code)}
                </p>
              </div>
            </div>
          )}

          <Separator />

          <div>
            <p className="mb-3 text-sm font-medium">Split between</p>
            <div className="space-y-3">
              {owedUsers.map((eu) => {
                const net = parseFloat(eu.net_balance);
                return (
                  <div key={eu.user_id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {eu.user?.picture?.medium && (
                        <AvatarImage src={eu.user.picture.medium} />
                      )}
                      <AvatarFallback className="text-xs">
                        {eu.user?.first_name?.[0]}
                        {eu.user?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {eu.user?.first_name} {eu.user?.last_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(eu.owed_share, expense.currency_code)}
                      </p>
                      {net !== 0 && (
                        <p
                          className={`text-xs ${
                            net > 0 ? "text-positive" : "text-negative"
                          }`}
                        >
                          {net > 0 ? "gets back" : "owes"}{" "}
                          {formatCurrency(
                            Math.abs(net).toString(),
                            expense.currency_code
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {expense.details && (
            <>
              <Separator />
              <div>
                <p className="mb-1 text-sm font-medium">Notes</p>
                <p className="text-sm text-muted-foreground">
                  {expense.details}
                </p>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              Created by {expense.created_by.first_name}{" "}
              {expense.created_by.last_name} on{" "}
              {formatFullDate(expense.created_at)}
            </p>
            {expense.updated_by && (
              <p>
                Updated by {expense.updated_by.first_name}{" "}
                {expense.updated_by.last_name} on{" "}
                {formatFullDate(expense.updated_at)}
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
