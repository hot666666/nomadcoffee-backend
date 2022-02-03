import client from "../../client";
import { protectedResolver } from "../../users/user.util";
import { processCategory } from "../coffeeShop.utils";

export default {
  Mutation: {
    editCoffeeShop: protectedResolver(
      async (
        _,
        { id, name, latitude, longitude, file, category },
        { loggedInUser }
      ) => {
        const shop = await client.coffeeShop.findUnique({
          where: {
            id,
          },
          include: {
            categories: {
              select: {
                id: true,
              },
            },
          },
        });

        if (!shop) {
          return {
            ok: false,
            error: "not existing shop!",
          };
        }

        try {
          let photoUrl = null;
          if (file) {
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

            if (deletedPhotos.length > 0) {
              deletedPhotos.forEach(
                async (photo) => await deleteUploadedFile(photo.url, "uploads")
              );
            }
          }

          photoUrl = await uploadToS3(file, loggedInUser.id, "uploads");
          await client.coffeeShopPhoto.deleteMany({
            where: {
              shop: {
                id,
              },
            },
          });

          const updatedShop = await client.coffeeShop.update({
            where: {
              id,
            },
            data: {
              name,
              latitude,
              longitude,
              ...(photoUrl && {
                photos: {
                  create: {
                    url: photoUrl,
                  },
                },
              }),
              ...(category && {
                categories: {
                  disconnect: shop.categories,
                  connectOrCreate: processCategory(category),
                },
              }),
            },
          });

          return {
            ok: true,
            coffeeShop: updatedShop,
          };
        } catch (e) {
          return {
            ok: false,
            error: `${e}`,
          };
        }
      }
    ),
  },
};
