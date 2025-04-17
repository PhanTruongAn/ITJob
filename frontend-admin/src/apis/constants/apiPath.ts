function path(root: string, subApi: string) {
  return `${root}${subApi}`;
}
export const ROOT_API = "/api/v1";
export const PATH_API = {
  user: {
    root: path(ROOT_API, "/users"),
    filter: path(ROOT_API, "/users/filter"),
  },
  company: {
    root: path(ROOT_API, "/companies"),
  },
  country: {
    root: path(ROOT_API, "/countries"),
  },
};
