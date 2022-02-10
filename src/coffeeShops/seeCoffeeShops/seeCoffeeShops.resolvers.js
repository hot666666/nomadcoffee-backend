import client from "../../client";
import { protectedResolver } from "../../users/user.util";

export default {
  Query: {
    seeCoffeeShops: protectedResolver(
      async (_, { cursor }, { loggedInUser }) => {
        const shops = await client.coffeeShop.findMany({
          where: {
            user: {
              id: loggedInUser.id,
            },
          },
          orderBy: {
            id: "desc",
          },
          take: 10,
          skip: cursor ? 1 : 0,
          ...(cursor && { cursor: { id: cursor } }),
        });

        const endCursor = shops.length !== 0 ? shops[shops.length - 1].id : 0;

        return {
          coffeeShops: shops,
          pageInfo: {
            lastCursor: endCursor,
            hasNextPage: Boolean(shops.length >= 10),
          },
        };
      }
    ),
  },
};
