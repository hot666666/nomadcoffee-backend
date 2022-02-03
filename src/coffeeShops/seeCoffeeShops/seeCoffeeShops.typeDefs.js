import { gql } from "apollo-server-core";

export default gql`
  type PageInfo {
    lastCursor: Int!
    hasNextPage: Boolean!
  }
  type SeeCoffeeShopsResult {
    coffeeShops: [CoffeeShop!]!
    pageInfo: PageInfo!
  }
  type Query {
    seeCoffeeShops(operation: String, cursor: Int): SeeCoffeeShopsResult!
  }
`;
