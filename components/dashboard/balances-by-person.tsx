import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/format";
import type { SplitwiseFriend } from "@/types/splitwise";

type PersonBalance = {
  friend: SplitwiseFriend;
  amount: number;
  currency: string;
};

function collect(friends: SplitwiseFriend[]) {
  const owedToYou: PersonBalance[] = [];
  const youOwe: PersonBalance[] = [];

  for (const friend of friends) {
    if (!friend.balance) continue;
    for (const b of friend.balance) {
      const amount = parseFloat(b.amount);
      if (amount > 0) {
        owedToYou.push({ friend, amount, currency: b.currency_code });
      } else if (amount < 0) {
        youOwe.push({ friend, amount: Math.abs(amount), currency: b.currency_code });
      }
    }
  }

  owedToYou.sort((a, b) => b.amount - a.amount);
  youOwe.sort((a, b) => b.amount - a.amount);
  return { owedToYou, youOwe };
}

function displayName(friend: SplitwiseFriend): string {
  const first = friend.first_name ?? "";
  const last = friend.last_name ?? "";
  return [first, last].filter(Boolean).join(" ").trim() || friend.email;
}

function initials(friend: SplitwiseFriend): string {
  const first = friend.first_name?.[0] ?? "";
  const last = friend.last_name?.[0] ?? "";
  return (first + last).toUpperCase() || friend.email.slice(0, 2).toUpperCase();
}

function PersonRow({
  entry,
  tone,
}: {
  entry: PersonBalance;
  tone: "positive" | "negative";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-8 w-8 shrink-0">
          {entry.friend.picture?.medium && (
            <AvatarImage src={entry.friend.picture.medium} />
          )}
          <AvatarFallback className="text-xs">
            {initials(entry.friend)}
          </AvatarFallback>
        </Avatar>
        <p className="truncate text-sm font-medium">
          {displayName(entry.friend)}
        </p>
      </div>
      <p
        className={`shrink-0 text-sm font-semibold ${
          tone === "positive" ? "text-positive" : "text-negative"
        }`}
      >
        {formatCurrency(entry.amount, entry.currency)}
      </p>
    </div>
  );
}

export function BalancesByPerson({ friends }: { friends: SplitwiseFriend[] }) {
  const { owedToYou, youOwe } = collect(friends);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Owed to You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {owedToYou.length === 0 ? (
            <p className="text-sm text-muted-foreground">No one owes you.</p>
          ) : (
            owedToYou.map((entry, i) => (
              <PersonRow
                key={`${entry.friend.id}-${entry.currency}-${i}`}
                entry={entry}
                tone="positive"
              />
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">You Owe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {youOwe.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You don&apos;t owe anyone.
            </p>
          ) : (
            youOwe.map((entry, i) => (
              <PersonRow
                key={`${entry.friend.id}-${entry.currency}-${i}`}
                entry={entry}
                tone="negative"
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
