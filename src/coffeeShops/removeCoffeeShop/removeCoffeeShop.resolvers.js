import client from "../../client";
import { deleteUploadedFile } from "../../shared/shared.utils";
import { protectedResolver } from "../../users/user.util";

export default {
  Mutation: {
    removeCoffeeShop: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const shop = await client.coffeeShop.findUnique({
        where: { id },
        select: { userId: true },
      });
      if (!shop) {
        return {
          ok: false,
          error: "not existing shop.",
        };
      } else if (shop.userId !== loggedInUser.id) {
        return {
          ok: false,
          error: "you cannot remove it",
        };
      } else {
        const deletedPhotos = await client.coffeeShopPhoto.findMany({
          where: {
            shop: {
              id,
            },
          },
          select: {
            url: true,
          },
        });

        deletedPhotos.forEach(
          async (photo) => await deleteUploadedFile(photo.url, "uploads")
        );

        await client.coffeeShopPhoto.deleteMany({
          where: {
            shop: {
              id,
            },
          },
        });

        const removedShop = await client.coffeeShop.delete({
          where: {
            id,
          },
        });

        return {
          ok: true,
          coffeeShop: removedShop,
        };
      }
    }),
  },
};
