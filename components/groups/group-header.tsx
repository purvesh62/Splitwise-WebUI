import Image from "next/image";
import { Users } from "lucide-react";
import type { SplitwiseGroup } from "@/types/splitwise";

export function GroupHeader({ group }: { group: SplitwiseGroup }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {group.avatar?.medium ? (
        <Image
          src={group.avatar.medium}
          className="rounded-full shrink-0"
          width={40}
          height={40}
          alt={group.name}
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold tracking-tight capitalize sm:text-xl">
          {group.name}
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          {group.members.length} members
        </p>
      </div>
    </div>
  );
}
