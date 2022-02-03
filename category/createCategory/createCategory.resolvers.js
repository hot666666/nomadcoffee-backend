import client from "../../client";
import { createSlug } from "../../coffeeShops/coffeeShop.utils";
import { protectedResolver } from "../../users/user.util";

export default {
  Mutation: {
    createCategory: protectedResolver(async (_, { category }) => {
      const existedCategory = await client.category.findUnique({
        where: {
          name: category,
        },
      });

      if (existedCategory) {
        return {
          ok: false,
          error: "already used category!",
        };
      }

      try {
        await client.category.create({
          data: {
            name: category,
            slug: createSlug(category),
          },
        });
        return {
          ok: true,
        };
      } catch (error) {
        return {
          ok: false,
          error: `${error}`,
        };
      }
    }),
  },
};
