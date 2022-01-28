import "dotenv/config";
import { ApolloServer } from "apollo-server";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/user.util";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
