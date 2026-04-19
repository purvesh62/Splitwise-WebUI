import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatFullDate } from "@/lib/format";
import { getCategoryColor } from "@/lib/constants";
import type { GroupExpense } from "@/types/splitwise";
import { TbCategoryPlus } from "react-icons/tb";

export function RecentExpenses({ expenses }: { expenses: GroupExpense[] }) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent expenses.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {expenses.map((expense) => {
          const payer = expense.users.find(
            (u) => parseFloat(u.paid_share) > 0
          );
          return (
            <div
              key={expense.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${getCategoryColor(
                    expense.category.id
                  )}`}
                >
                  <TbCategoryPlus className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{expense.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFullDate(expense.created_at)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-positive">
                  {formatCurrency(expense.cost, expense.currency_code)}
                </p>
                {payer && (
                  <p className="text-xs text-muted-foreground">
                    {payer.user?.first_name} paid
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
