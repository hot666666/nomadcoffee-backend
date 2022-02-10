import client from "../../client";
import { uploadToS3 } from "../../shared/shared.utils";
import { protectedResolver } from "../../users/user.util";
import { processCategory } from "../coffeeShop.utils";

export default {
  Mutation: {
    createCoffeeShop: protectedResolver(
      async (
        _,
        { name, category, latitude, longitude, file },
        { loggedInUser }
      ) => {
        console.log(file);
        let photoUrls = [];
        if (file?.length > 0) {
          photoUrls = await Promise.all(
            file.map(
              async (photo) =>
                await uploadToS3(photo, loggedInUser.id, "uploads")
            )
          );
        }
        console.log(photoUrls);
        try {
          const newShop = await client.coffeeShop.create({
            data: {
              name,
              latitude,
              longitude,
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
              ...(category && {
                categories: { connectOrCreate: processCategory(category) },
              }),
            },
          });
          if (photoUrls.length > 0) {
            await Promise.all(
              photoUrls.map(
                async (url) =>
                  await client.coffeeShopPhoto.create({
                    data: {
                      url,
                      shop: {
                        connect: {
                          id: newShop.id,
                        },
                      },
                    },
                  })
              )
            );
          }
          return {
            ok: true,
            coffeeShop: newShop,
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
