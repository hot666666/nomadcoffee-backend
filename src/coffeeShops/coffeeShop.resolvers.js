import client from "../client";

export default {
  CoffeeShop: {
    isMine: async ({ id }, _, { loggedInUser }) => {
      const coffeeShop = await client.coffeeShop.findUnique({
        where: { id },
      });

      if (!loggedInUser) {
        return false;
      }
      return coffeeShop.userId === loggedInUser.id;
    },
    user: ({ id }) =>
      client.user.findFirst({
        where: {
          shops: {
            some: {
              id,
            },
          },
        },
      }),
    categories: ({ id }, { lastId }) =>
      client.coffeeShop
        .findUnique({
          where: { id },
        })
        .categories({
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        }),
    photos: ({ id }, { lastId }) =>
      client.coffeeShop
        .findUnique({
          where: { id },
        })
        .photos({
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        }),
  },
};
