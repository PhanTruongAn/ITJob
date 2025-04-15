import { ElementType, lazy, Suspense } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { PATH_AUTH, PATH_DASHBOARD, ROOT_DASHBOARD } from "./paths";
import LayoutAdmin from "../layouts/layout.admin";

const Loadable = (Component: ElementType) => (props: any) => {
  const { pathname } = useLocation();

  const isDashboard = pathname.includes("/dashboard");

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};
export default function Router() {
  return useRoutes([
    {
      path: PATH_AUTH.login,
      element: <Login />,
    },
    {
      path: ROOT_DASHBOARD,
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          path: "",
          children: [
            {
              element: <Navigate to="/" replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.userManage.list,
              element: <UserManageList />,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to="/" replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.companyManage.list,
              element: <CompanyManageList />,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to="/" replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.jobManage.list,
              element: <JobManageList />,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to="/" replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.resumeManage.list,
              element: <ResumeManageList />,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to="/" replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.roleManage.list,
              element: <RoleManageList />,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to="/" replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.permissionManage.list,
              element: <PermissionManageList />,
            },
          ],
        },
      ],
    },
  ]);
}
const Login = Loadable(lazy(() => import("../page/login")));
const UserManageList = Loadable(lazy(() => import("../page/user")));
const CompanyManageList = Loadable(lazy(() => import("../page/company")));
const JobManageList = Loadable(lazy(() => import("../page/job")));
const RoleManageList = Loadable(lazy(() => import("../page/role")));
const ResumeManageList = Loadable(lazy(() => import("../page/resume")));
const PermissionManageList = Loadable(lazy(() => import("../page/permission")));
const NotFound = Loadable(lazy(() => import("../page/404")));
