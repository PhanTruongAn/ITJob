function path(root: string, subLink: string) {
  return `${root}${subLink}`;
}
export const ROOT_AUTH = "/auth/customer";
export const ROOT_DASHBOARD = "/dashboard";
export const PATH_AUTH = {
  login: path(ROOT_AUTH, "/login"),
};
export const PATH_DASHBOARD = {
  root: "/dashboard/users",
  userManage: {
    root: path(ROOT_DASHBOARD, "/"),
    list: path(ROOT_DASHBOARD, "/users"),
  },
  companyManage: {
    list: path(ROOT_DASHBOARD, "/companies"),
    create: path(ROOT_DASHBOARD, "/companies/create"),
  },
  jobManage: {
    list: path(ROOT_DASHBOARD, "/jobs"),
  },
  roleManage: {
    list: path(ROOT_DASHBOARD, "/roles"),
  },
  resumeManage: {
    list: path(ROOT_DASHBOARD, "/resumes"),
  },
  permissionManage: {
    list: path(ROOT_DASHBOARD, "/permissions"),
  },
};
