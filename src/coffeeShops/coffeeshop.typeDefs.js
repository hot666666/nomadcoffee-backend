import { gql } from "apollo-server-core";

export default gql`
  scalar Upload
  type CoffeeShop {
    id: Int!
    name: String!
    latitude: String!
    longitude: String!
    user: User!
    isMine: Boolean!
    categories(lastId: Int): [Category]
    photos(lastId: Int): [CoffeeShopPhoto]
    createdAt: String!
    updatedAt: String!
  }
  type CoffeeShopPhoto {
    id: Int!
    url: String!
    shop: CoffeeShop!
    createdAt: String!
    updatedAt: String!
  }
`;
