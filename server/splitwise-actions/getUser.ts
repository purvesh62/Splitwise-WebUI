const Splitwise = require("splitwise");

const sw = Splitwise({
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
});

export default async function getUser() {
  const user: SplitwiseUser = sw
    .getCurrentUser()
    .then((res: SplitwiseUser) => {
      return res;
    })
    .catch((error: Error) => {
      console.log(error);
    });
  return user;
}
