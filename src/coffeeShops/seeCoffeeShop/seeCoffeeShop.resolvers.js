import client from "../../client";

export default {
  Query: {
    seeCoffeeShop: (_, { name }) =>
      client.coffeeShop.findMany({
        where: {
          name: {
            startsWith: name,
          },
        },
      }),
  },
};
