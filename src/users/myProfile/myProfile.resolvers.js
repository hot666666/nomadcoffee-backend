import client from "../../client";

export default {
  Query: {
    myProfile: (_, __, { loggedInUser }) => {
      console.log(loggedInUser);
      return client.user.findUnique({
        where: {
          id: loggedInUser.id,
        },
        include: {
          following: true,
          followers: true,
        },
      });
    },
  },
};
