import { Metadata } from "next"
import { AddExpenseDrawer } from "@/components/application/add-expense-drawer";
import * as React from "react";
import { getGroup, getGroupExpense } from "@/server/splitwise-actions/getGroups";
import GroupExpensesTable from "@/components/application/group-expenses";
import Image from "next/image";

export const metadata: Metadata = {
	title: "Groups",
	description: "User groups",
}

export default async function Page({ params }: { params: any }) {

	const groupExpenses = await getGroupExpense(params.group)

	const group = await getGroup(params.group);
	// const res = await testCreateExpense();
	return <div className="">
		<nav className={"flex w-full p-4 gap-2 border-2 justify-between items-center"}>
			<div className={`flex gap-2 cursor-pointer items-center`}>
				<Image src={group?.avatar?.medium} alt={group.name} width={40} height={30} />
				<span
					className="text-lg font-sans  bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-900">
					{group.name}
				</span>
			</div>
			<AddExpenseDrawer userGroup={group} />
		</nav>
		<GroupExpensesTable userGroup={groupExpenses} group={group} />
	</div>
}