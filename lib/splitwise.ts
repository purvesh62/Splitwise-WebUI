const Splitwise = require("splitwise");

export function createSplitwiseClient(apiKey: string) {
  return Splitwise({
    consumerKey: "dummy",
    consumerSecret: "dummy",
    accessToken: apiKey,
  });
}
