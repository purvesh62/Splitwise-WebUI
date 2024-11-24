import UserAvatar from "@/components/application/user-avatar";
import {auth} from "@/server/auth";
import getUser from "@/server/splitwise-actions/getUser";
import Link from "next/link";

export default async function Header() {
	const session = await auth();
	if (!session) {
		return <div></div>
	}
	const user = await getUser();
	return <div
		className={"w-full flex justify-between h-14 items-center px-2 py-9 bg-primary text-primary-foreground" +
			" top-0"}>
		<Link href="/"><h2 className={"pl-2"}>Pseudo Split wise</h2></Link>
		<div>
			<UserAvatar user={user}/>
		</div>
	</div>
}