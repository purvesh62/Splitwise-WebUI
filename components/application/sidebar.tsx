import Link from "next/link";
import {Contact, Users} from "lucide-react";
import React from "react";
import {getGroups} from "@/server/splitwise-actions/getGroups";
import {getFriends} from "@/server/splitwise-actions/getFriends";

export default async function Sidebar() {
	const groups: SplitwiseGroup[] = await getGroups();
	const friends: SplitwiseFriend[] = await getFriends();
	
	return <div>
		<div className={"text-sm h-10 bg-gray-100 border-2 border-l-0 border-r-0 border-t-gray-300" +
			" border-b-gray-300" +
			" p-2"}>
			Groups
		</div>
		<div className={"flex flex-col gap-1 max-h-96 overflow-y-auto"}>
			{groups && groups.map((group) => {
				return <Link
					href={`/app/group/${group.id}`}
					key={group.id}
					className={"px-2 flex items-center w-full text-sm hover:bg-gray-200" +
						" rounded-sm cursor-pointer"}>
					<span><Users size={12}/></span>
					<p className={"w-full truncate overflow-hidden whitespace-nowrap p-2"}>
						{group.name}
					</p>
				</Link>
			})}
		</div>
		<div className={"text-sm bg-gray-100 border-2 border-l-0 border-r-0 border-t-gray-300" +
			" border-b-gray-300" +
			" p-2"}>
			Friends
		</div>
		<div className={"flex flex-col gap-1 max-h-96 overflow-y-auto"}>
			{friends && friends.map((friend) => {
				return <Link
					// href={`/v2/friend/${friend.id}`}
					href={"#"}
					key={friend.id}
					className={"px-2 flex items-center w-full text-sm hover:bg-gray-200" +
						" rounded-sm cursor-pointer"}
				>
					<span><Contact size={12}/></span>
					<p className={"w-full truncate overflow-hidden whitespace-nowrap p-2"}>
						{friend.first_name} {friend.last_name}
					</p>
				</Link>
			})}
		</div>
	</div>
}