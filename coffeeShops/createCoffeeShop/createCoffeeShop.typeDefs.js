import { gql } from "apollo-server-core";

export default gql`
  type CreateCoffeeShopResult {
    ok: Boolean!
    error: String
    coffeeShop: CoffeeShop
  }
  type Mutation {
    createCoffeeShop(
      name: String!
      latitude: String!
      longitude: String!
      category: String
      file: Upload
    ): CreateCoffeeShopResult
  }
`;
