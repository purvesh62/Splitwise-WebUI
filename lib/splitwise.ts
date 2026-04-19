const Splitwise = require("splitwise");

const globalForSplitwise = globalThis as unknown as {
  splitwise: ReturnType<typeof Splitwise>;
};

export const sw =
  globalForSplitwise.splitwise ??
  Splitwise({
    consumerKey: process.env.SPLITWISE_CONSUMER_KEY ?? "dummy",
    consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET ?? "dummy",
    accessToken: process.env.SPLITWISE_API_KEY,
  });

if (process.env.NODE_ENV !== "production") {
  globalForSplitwise.splitwise = sw;
}
