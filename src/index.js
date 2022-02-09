import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { graphqlUploadExpress } from "graphql-upload";
import { typeDefs, resolvers } from "./schema";
import logger from "morgan";
import { getUser } from "./users/user.util";
const { finished } = require("stream/promises");

const PORT = process.env.PORT;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    uploads: false,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    },
    // below should be omitted for real world..
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    introspection: true,
    playground: true,
  });

  await server.start();

  const app = express();

  app.use(graphqlUploadExpress());
  app.use(logger("dev"));
  server.applyMiddleware({ app });

  await new Promise((r) => app.listen({ port: PORT }, r));

  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startServer();
