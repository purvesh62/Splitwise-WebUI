import {auth} from "@/server/auth";
import {redirect} from "next/navigation";
import UserGroups from "@/components/application/groups";
import {getGroups} from "@/server/splitwise-actions/getGroups"
import Header from "@/components/application/header";

export default async function Home() {
	const session = await auth();
	
	if (!session) {
		return redirect('/auth/login')
	}
	return redirect("/v2/group");
	
	const groups = await getGroups();
	return <div>
		<Header/>
		<UserGroups splitwiseGroups={groups}/>
	</div>
}
