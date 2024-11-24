import {auth} from "@/server/auth";
import {redirect} from "next/navigation";
import {AddExpenseDrawer} from "@/components/application/add-expense-drawer";
import axios from "axios";
import {Group} from "@/types/splitwise-types";
import UserGroups from "@/components/application/groups";
import {getGroups, getGroup, getGroupExpense} from "@/server/splitwise-actions/getGroups"
import Header from "@/components/application/header";

export default async function Home() {
	const session = await auth();
	
	if (!session) {
		return redirect('/auth/login')
	}
	
	return redirect("/v2/group");
	
	const groups = await getGroups();
	// const groupExpenses = await getGroupExpense(69745372)
	// const userGroups: Group[] = await axios.get(
	// 	`http://127.0.0.1:6001/user-groups/1`,
	// 	{
	// 		method: "GET"
	// 	}).then(res => {
	// 		if (res.data) {
	// 			return res.data;
	// 		} else {
	// 			return []
	// 		}
	// 	})
	
	return <div>
		<Header/>
		<UserGroups splitwiseGroups={groups}/>
		{/*<AddExpenseDrawer/>*/}
	</div>
}
