import client from "../../client";
import { deleteUploadedFile, uploadToS3 } from "../../shared/shared.utils";
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
        console.log(id, name, latitude, longitude, file, category);
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
          console.log(file);
          if (file?.length > 0) {
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

            if (deletedPhotos.length !== 0) {
              deletedPhotos.forEach(
                async (photo) => await deleteUploadedFile(photo.url, "uploads")
              );
            }

            photoUrl = await Promise.all(
              file.map(
                async (photo) =>
                  await uploadToS3(photo, loggedInUser.id, "uploads")
              )
            );

            console.log(photoUrl);
            await client.coffeeShopPhoto.deleteMany({
              where: {
                shop: {
                  id,
                },
              },
            });
          }
          console.log("여기까지옴");
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
                  disconnect: shop.photos,
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
          if (photoUrl?.length > 0) {
            await Promise.all(
              photoUrl.map(
                async (url) =>
                  await client.coffeeShopPhoto.create({
                    data: {
                      url,
                      shop: {
                        connect: {
                          id: updatedShop.id,
                        },
                      },
                    },
                  })
              )
            );
          }
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
