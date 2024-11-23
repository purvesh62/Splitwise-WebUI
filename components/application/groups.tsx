'use client'
import * as React from "react"
import { Group } from "@/types/splitwise-types";

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const tags = Array.from({ length: 10 }).map(
	(_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export default function UserGroups({ splitwiseGroups }: { splitwiseGroups: SplitwiseGroup[] }) {
	return (
		<ScrollArea className="w-full rounded-md border">
			<div className="p-4">
				<h4 className="mb-4 text-md font-medium leading-none">Groups</h4>
				<Separator className="my-2 font-bold" />
				{splitwiseGroups.length > 0 && splitwiseGroups.map((group) => (
					<div key={group?.id}>
						<Link href={`/group/${group.id}`} key={group.id} className="text-sm">
							{group?.name}
						</Link>
						<Separator className="my-2" />
					</div>
				))}
			</div>
		</ScrollArea>
	)
}
