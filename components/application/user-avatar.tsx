'use client'
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

export default function UserAvatar({ user }: { user: SplitwiseUser }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>
					<Avatar>
						<AvatarImage src={user.picture?.medium as string} alt="@shadcn" />
						<AvatarFallback>{user.first_name}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 mr-5">
				<DropdownMenuLabel>
					{`${user.first_name} ${user.last_name}`}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem disabled>API</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Button variant={'ghost'} className={"text-sm p-0"} onClick={() => void signOut()}>
						Log out
					</Button>
					{/*<DropdownMenuShortcut></DropdownMenuShortcut>*/}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
