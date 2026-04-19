import Image from "next/image";
import { Users } from "lucide-react";
import type { SplitwiseGroup } from "@/types/splitwise";

export function GroupHeader({ group }: { group: SplitwiseGroup }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {group.avatar?.medium ? (
          <Image
            src={group.avatar.medium}
            className="rounded-full"
            width={40}
            height={40}
            alt={group.name}
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight capitalize">
            {group.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {group.members.length} members
          </p>
        </div>
      </div>
    </div>
  );
}
