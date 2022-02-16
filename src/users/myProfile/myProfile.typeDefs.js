import { gql } from "apollo-server";

export default gql`
  type Query {
    myProfile(p: String): User
  }
`;
