function path(root: string, subApi: string) {
  return `${root}${subApi}`
}
export const ROOT_API = "/api/v1"
export const PATH_API = {
  user: {
    root: path(ROOT_API, "/users"),
    filter: path(ROOT_API, "/users"),
  },
  company: {
    root: path(ROOT_API, "/companies"),
  },
  country: {
    root: path(ROOT_API, "/countries"),
  },
  file: {
    root: path(ROOT_API, "/file"),
    sign: path(ROOT_API, "/file/signed"),
  },

  job: {
    root: path(ROOT_API, "/jobs"),
  },

  skill: {
    root: path(ROOT_API, "/skills"),
  },
  subscriber: {
    root: path(ROOT_API, "/subscribers"),
  },
  review: {
    root: path(ROOT_API, "/reviews/companies"),
  },
  permission: {
    root: path(ROOT_API, "/permissions"),
  },
  role: {
    root: path(ROOT_API, "/roles"),
  },
  resume: {
    root: path(ROOT_API, "/resumes"),
  },
  recommendation: {
    root: path(ROOT_API, "/recommendations"),
  },
}
