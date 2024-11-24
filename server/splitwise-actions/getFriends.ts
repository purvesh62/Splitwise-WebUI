const Splitwise = require("splitwise");

const sw = Splitwise({
	consumerKey: process.env.consumerKey,
	consumerSecret: process.env.consumerSecret,
});

export async function getFriends() {
	const userFriends = sw
		.getFriends()
		.then((res: GroupExpenses[]) => {
			return res;
		})
		.catch((error: Error) => {
			console.log(error);
		});
	return userFriends;
}
