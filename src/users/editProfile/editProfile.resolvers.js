import client from "../../client";
import { protectedResolver } from "../user.util";
import bcrypt from "bcrypt";
import { deleteUploadedFile, uploadToS3 } from "../../shared/shared.utils";

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (_, { password, avatar }, { loggedInUser }) => {
        let newPassword = null;
        let newAvatarURL = null;
        if (password) {
          newPassword = await bcrypt.hash(password, 10);
        }
        if (avatar) {
          const user = await client.user.findUnique({
            where: {
              id: loggedInUser.id,
            },
            select: {
              avatarURL: true,
            },
          });

          if (user?.avatarURL) {
            await deleteUploadedFile(user.avatarURL, "avatar");
          }
          newAvatarURL = await uploadToS3(avatar, loggedInUser.id, "avatar");
        }
        const updatedUser = await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            ...(newAvatarURL && { avatarURL: newAvatarURL }),
            ...(newPassword && { password: newPassword }),
          },
        });
        if (updatedUser.id) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: "Could not update profile.",
          };
        }
      }
    ),
  },
};
