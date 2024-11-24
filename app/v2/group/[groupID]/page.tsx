import {Metadata} from "next"
import * as React from "react";
import {getGroup, getGroupExpense, getGroups} from "@/server/splitwise-actions/getGroups";
import Image from "next/image";
import {TbCategoryPlus} from "react-icons/tb";
import {groups} from "@/data/groups";
import {groupExpenseData} from "@/data/group-expense";
import {groupSelected} from "@/data/group-selected";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import {AddExpenseDrawer} from "@/components/application/add-expense-drawer";
import {redirect} from "next/navigation";
import {auth} from "@/server/auth";

export const metadata: Metadata = {
	title: "Group",
	description: "User groups",
}

export default async function Page({params}: { params: any }) {
	const session = await auth();
	
	if (!session) {
		return redirect('/auth/login')
	}
	
	const group: SplitwiseGroup = await getGroup(params.groupID);
	// const group = groupSelected;
	// const groupExpenses = groupExpenseData;
	const groupExpenses: GroupExpenses[] = await getGroupExpense(params.groupID);
	const colors = ['cyan', 'pink', 'green', 'blue', 'violet', 'purple'];
	
	
	if (groupExpenses === undefined) {
		return <div></div>
	}
	// const groupExpense: GroupExpenses[] = await getGroupExpense(params.groupID);
	return <div className="w-full flex gap-4">
		<div className={"max-w-[444rem] border-1 border-gray-200 shadow-2xl p-2"}>
			
			<nav className={" flex justify-between w-full max-h-20 py-4 mb-2 border-b-2"}>
				<div className={"flex gap-2 items-center"}>
					<Image src={group.avatar?.medium as string} className={"rounded-full"} width={40} height={40}
					       alt={"Group Avatar"}/>
					<p className={"text-xl capitalize font-mono"}>{group.name}</p>
				</div>
				<div>
					{/*<Button className={"bg-green-500 w-32 h-8 hover:bg-green-400"}>Add Expense</Button>*/}
					<AddExpenseDrawer userGroup={group}/>
				</div>
			</nav>
			
			{groupExpenses && groupExpenses.map((expense: GroupExpenses) => {
				return <div className={"flex w-full justify-start border-b-2 py-2"} key={expense.id}>
					<div className={"flex flex-col w-10 pr-2 text-gray-500 justify-center items-center"}>
						<p className={"text-xs"}>{new Date(expense.created_at).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric"
						}).split(" ")[0]}</p>
						<p className={"text-xl"}>{new Date(expense.created_at).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric"
						}).split(" ")[1].padStart(2, "0")}</p>
					</div>
					
					<div className={"flex w-full items-center gap-2 text-gray-700 justify-between min-w-[700px]"}>
						<div className={"flex gap-4 pr-4 truncate overflow-hidden whitespace-nowrap"}>
							<span className={cn(`bg-${colors[Math.floor(Math.random() * colors.length)]}-200`)}>
								<TbCategoryPlus
									size={20}
									className={cn("h-10 p-2 w-10")}
								/>
							</span>
							<p>{expense.description}</p>
						</div>
						<div className={"flex flex-col min-w-32"}>
							<p className={"text-xs text-end"}>
								{expense.users.filter(user => user.paid_share !== '0.00')[0].user.first_name}
								{" "}Paid</p>
							<p className={"w-full text-end font-semibold text-green-600"}>${expense.cost}</p>
						</div>
					</div>
				</div>
			})}
		</div>
		
		<div className={"flex flex-col gap-4 min-w-80"}>
			<p className={"text-lg text-gray-500 font-mono pt-5"}>Group Balances</p>
			{group.members.map(user => {
				return <div className={"flex gap-4"} key={user.id}>
					<Avatar>
						<AvatarImage src={user.picture.medium} alt={user.first_name}/>
					</Avatar>
					<div className={"cursor-pointer"}>
						<p className={"text-xs"}>{user.first_name} {user.last_name}</p>
						{user.balance.length > 0 && user.balance[0] !== undefined &&
                            <p className={cn("text-sm", user.balance[0].amount > "0" ? "text-green-600" : "text-red-600")}>{user.balance[0].amount > "0" ? "gets back $" : "owes $"}{Number.parseFloat(user.balance[0].amount)}</p>}
					</div>
				</div>
			})}
		</div>
	</div>
}