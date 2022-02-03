import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    createCategory(category: String!): MutationResponse!
  }
`;
