export const createSlug = (name) =>
  name
    .match(/[^\s]+/g)
    ?.join("-")
    .toLowerCase();

export const processCategory = (category) => {
  const slug = createSlug(category);

  return {
    where: {
      name: category,
    },
    create: {
      name: category,
      slug,
    },
  };
};
