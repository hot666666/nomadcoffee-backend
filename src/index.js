import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/user.util";
const { finished } = require("stream/promises");

const PORT = process.env.PORT;
/*
playground: true,
introspection: true,
*/
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
    uploads: false,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token || null),
      };
    },
  });

  await server.start();

  const app = express();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());
  app.use("/static", express.static("uploads"));
  server.applyMiddleware({ app });

  await new Promise((r) => app.listen({ port: PORT }, r));

  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startServer();
