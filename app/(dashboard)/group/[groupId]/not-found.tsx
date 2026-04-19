import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GroupNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-lg font-semibold">Group Not Found</h2>
      <p className="text-sm text-muted-foreground">
        This group does not exist or you don&apos;t have access.
      </p>
      <Button asChild>
        <Link href="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
