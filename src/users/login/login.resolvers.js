import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      try {
        const user = await client.user.findUnique({ where: { username } });
        if (!user) {
          return {
            ok: false,
            error: "invalid username",
          };
        }
        const isOk = await bcrypt.compare(password, user.password);
        if (!isOk) {
          return {
            ok: false,
            error: "not correct password",
          };
        }
        const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
        console.log(`${user.id}가 로그인함`);
        return {
          ok: true,
          token,
        };
      } catch (e) {
        return {
          ok: false,
          error: "error!",
        };
      }
    },
  },
};
