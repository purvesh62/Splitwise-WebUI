import {auth} from "@/server/auth";
import {redirect} from "next/navigation";
import {getGroups} from "@/server/splitwise-actions/getGroups";

export default async function Page() {
	const session = await auth();
	if (!session) {
		return redirect('/auth/login')
	}
	const groups: SplitwiseGroup[] = await getGroups();
	return redirect(`/app/group/${groups[0].id}`);
}