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

/*
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { GraphQLUpload, graphqlUploadExpress } = require("graphql-upload");
const { finished } = require("stream/promises");

const typeDefs = gql`
  scalar Upload
  type File {
    filename: String!
  }
  type Query {
    otherFields: Boolean!
  }
  type Mutation {
    singleUpload(file: Upload!): File!
  }
`;

const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (_, { file }) => {
      const { createReadStream, filename } = await file;
      //const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
      const stream = createReadStream();
      const out = require("fs").createWriteStream(
        process.cwd() + "/uploads/" + filename
      ); //newFilename);
      console.log(process.cwd() + "/uploads/" + filename);
      stream.pipe(out);
      await finished(out);

      return { filename };
    },
  },
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  const app = express();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  app.use("/static", express.static("uploads"));
  await new Promise((r) => app.listen({ port: 4000 }, r));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
startServer();
*/
