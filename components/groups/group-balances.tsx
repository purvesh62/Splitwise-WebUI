import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/format";
import type { SplitwiseUser } from "@/types/splitwise";

export function GroupBalances({ members }: { members: SplitwiseUser[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Group Balances</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {members.map((member) => {
          const balance =
            member.balance.length > 0 ? parseFloat(member.balance[0].amount) : 0;
          const currencyCode =
            member.balance.length > 0 ? member.balance[0].currency_code : "CAD";

          return (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {member.picture?.medium && (
                  <AvatarImage src={member.picture.medium} alt={member.first_name} />
                )}
                <AvatarFallback className="text-xs">
                  {member.first_name?.[0]}
                  {member.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">
                  {member.first_name} {member.last_name}
                </p>
                {balance !== 0 && (
                  <p
                    className={`text-xs font-medium ${
                      balance > 0 ? "text-positive" : "text-negative"
                    }`}
                  >
                    {balance > 0 ? "gets back " : "owes "}
                    {formatCurrency(balance, currencyCode)}
                  </p>
                )}
                {balance === 0 && (
                  <p className="text-xs text-muted-foreground">settled up</p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
