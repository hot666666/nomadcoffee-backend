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
    following: [User]
    followers: [User]
    totalFollowing: Int!
    totalFollowers: Int!
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    _empty: String
  }
`;
