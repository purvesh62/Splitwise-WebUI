import {Contact, Landmark, Users} from "lucide-react";
import Link from "next/link"
import {
	DropdownMenu,
	DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator, DropdownMenuShortcut,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import getUser from "@/server/splitwise-actions/getUser";
import {getGroups} from "@/server/splitwise-actions/getGroups";
import {getFriends} from "@/server/splitwise-actions/getFriends";

import {friendsData} from "@/data/friends";
import {userData} from "@/data/user";
import {groups as groupData} from "@/data/groups";
import {auth} from "@/server/auth";
import {redirect} from "next/navigation";

export default async function Layout({children}: { children: React.ReactNode }) {
	const session = await auth();
	if (!session) {
		return redirect('/auth/login')
	}
	const user = await getUser();
	const groups: SplitwiseGroup[] = await getGroups();
	const friends: SplitwiseFriend[] = await getFriends()
	// const user = userData;
	// const groups = groupData;
	// const friends = friendsData;
	return (
		<>
			<nav className={"bg-[#5bc5a7] h-14 flex items-center px-5 justify-between"}>
				<div className={"flex gap-2 text-white cursor-pointer"}>
					<Landmark/>
					<p className={"font-mono text-lg outline-sky-500 font-bold"}>WiseSplit</p>
				</div>
				<div className={"flex items-center gap-2"}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<div className={"flex gap-2 justify-center items-center cursor-pointer"}>
								<Avatar className={"h-8 w-8"}>
									{user?.picture !== undefined && <AvatarImage src={user?.picture?.medium}/>}
									<AvatarFallback>{user && user.first_name.slice(0, 1)} {user?.last_name !== null && user.last_name.slice(0, 1)}</AvatarFallback>
								</Avatar>
								<div>
									<p className={"font-mono font-normal text-white"}>{user.first_name} {user.last_name}</p>
								</div>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator/>
							<DropdownMenuGroup>
								<DropdownMenuItem>
									Profile
									<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
								</DropdownMenuItem>
								<DropdownMenuItem>
									Settings
									<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator/>
							
							<DropdownMenuSeparator/>
							<DropdownMenuItem>Support</DropdownMenuItem>
							<DropdownMenuSeparator/>
							<DropdownMenuItem>
								Log out
								<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</nav>
			<main className={"lg:px-80 md:px-10 px-4 flex gap-1"}>
				<aside className={"max-w-[200px]"}>
					<div className={"text-sm h-10 bg-gray-100 border-2 border-l-0 border-r-0 border-t-gray-300" +
						" border-b-gray-300" +
						" p-2"}>
						Groups
					</div>
					<div className={"flex flex-col gap-1 min-h-1/2 overflow-y-auto"}>
						{groups && groups.map((group) => {
							return <Link
								href={`/v2/group/${group.id}`}
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
					<div className={"flex flex-col gap-1 min-h-1/2  overflow-y-auto"}>
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
				</aside>
				{children}
			</main>
		</>
	)
}