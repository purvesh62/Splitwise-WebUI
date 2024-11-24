import {auth} from "@/server/auth";
import {redirect} from "next/navigation";
import Navbar from "@/components/application/navbar";
import getUser from "@/server/splitwise-actions/getUser";
// import {userData} from "@/data/user";


export default async function AppLayout(
	{
		children,
	}: Readonly<{
		children: React.ReactNode;
	}>) {
	const session = await auth();
	if (!session) {
		return redirect('/auth/login')
	}
	// const user = userData;
	const user = await getUser();
	return (
		<div className={"w-full h-full"}>
			<Navbar user={user}/>
			{children}
		</div>
	);
}
