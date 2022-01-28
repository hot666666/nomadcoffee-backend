import client from "../../client";
import { protectedResolver } from "../user.util";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (_, { password, avatarURL }, { loggedInUser }) => {
        let newPassword = null;
        let newAvatarURL = null;
        if (password) {
          newPassword = await bcrypt.hash(password, 10);
        }
        if (avatarURL) {
          newAvatarURL = avatarURL;
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
