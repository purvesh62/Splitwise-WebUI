import {Landmark} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator, DropdownMenuShortcut,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import Link from "next/link";

export default function Navbar({user}: { user: SplitwiseUser }) {
	
	return <nav className={"bg-[#5bc5a7] h-14 w-full flex items-center px-5 justify-between"}>
		<Link href={"/app/group"} className={"flex gap-2 text-white cursor-pointer"}>
			<Landmark/>
			<p className={"font-mono text-lg outline-sky-500 font-bold"}>WiseSplit</p>
		</Link>
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
}