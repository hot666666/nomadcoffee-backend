import { gql } from "apollo-server-core";

export default gql`
  type User {
    id: Int!
    username: String!
    email: String!
    name: String!
    password: String!
    avatarURL: String
    location: String
    githubUsername: String
  }
  type Query {
    _empty: String
  }
`;
