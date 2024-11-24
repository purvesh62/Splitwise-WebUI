const Splitwise = require("splitwise");

const sw = Splitwise({
	consumerKey: process.env.consumerKey,
	consumerSecret: process.env.consumerSecret,
});

export async function getGroups() {
	const data = sw
		.getGroups()
		.then((res: SplitwiseGroup) => {
			return res;
		})
		.catch((error: Error) => {
			console.log(error);
		});
	return data
}

export async function getGroup(groupID: number) {
	// 69745372
	const data = sw
		.getGroup({id: groupID})
		.then((res: SplitwiseGroup[]) => {
			return res;
		})
		.catch((error: Error) => {
			console.log(error);
		});
	return data
}

export async function getGroupExpense(groupID: number) {
	const data = sw
		.getExpenses({group_id: groupID, limit: 100})
		.then((res: GroupExpenses[]) => {
			return res;
		})
		.catch((error: Error) => {
			console.log(error);
		});
	return data
}
