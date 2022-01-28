import { gql } from "apollo-server-core";

export default gql`
  type EditProfileResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    editProfile(password: String, avatarURL: String): EditProfileResult!
  }
`;
