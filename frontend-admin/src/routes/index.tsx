import { ElementType, lazy, Suspense } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { PATH_AUTH, PATH_DASHBOARD, ROOT_DASHBOARD } from "./paths";
import LayoutAdmin from "../layouts/layout.admin";
import AuthGuard from "../guards/AuthGuard";

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
      element: (
        <AuthGuard>
          <LayoutAdmin />
        </AuthGuard>
        // <LayoutAdmin />
      ),
      errorElement: <NotFound />,
      children: [
        {
          path: "",
          children: [
            {
              element: <Navigate to={PATH_DASHBOARD.userManage.list} replace />,
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
              element: <Navigate to={PATH_DASHBOARD.userManage.list} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.companyManage.list,
              element: <CompanyManageList />,
            },
            {
              path: PATH_DASHBOARD.companyManage.create,
              element: <CompanyManageCreate />,
            },
            {
              path: PATH_DASHBOARD.companyManage.edit,
              element: <CompanyManageEdit />,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={PATH_DASHBOARD.userManage.list} replace />,
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
              element: <Navigate to={PATH_DASHBOARD.userManage.list} replace />,
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
              element: <Navigate to={PATH_DASHBOARD.userManage.list} replace />,
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
              element: <Navigate to={PATH_DASHBOARD.userManage.list} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.permissionManage.list,
              element: <PermissionManageList />,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={PATH_DASHBOARD.userManage.list} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.skillManage.list,
              element: <SkillManageList />,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={PATH_DASHBOARD.userManage.list} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.subscriberManage.list,
              element: <SubscriberManageList />,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={PATH_DASHBOARD.userManage.list} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.reviewManage.list,
              element: <ReviewManageList />,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={PATH_DASHBOARD.userManage.list} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.countryManage.list,
              element: <CountryManageList />,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={PATH_DASHBOARD.userManage.list} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.recommendationManage.list,
              element: <RecommendationManageList />,
            },
          ],
        },
      ],
    },
    // Thêm route catch-all cho các URL không khớp
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
}

const Login = Loadable(lazy(() => import("../page/login")));
const UserManageList = Loadable(lazy(() => import("../page/user")));
const CompanyManageList = Loadable(lazy(() => import("../page/company")));
const CompanyManageCreate = Loadable(
  lazy(() => import("../page/company/components/create"))
);
const CompanyManageEdit = Loadable(
  lazy(() => import("../page/company/components/edit"))
);

const JobManageList = Loadable(lazy(() => import("../page/job")));
const RoleManageList = Loadable(lazy(() => import("../page/role")));
const ResumeManageList = Loadable(lazy(() => import("../page/resume")));
const PermissionManageList = Loadable(lazy(() => import("../page/permission")));
const SkillManageList = Loadable(lazy(() => import("../page/skill")));
const SubscriberManageList = Loadable(lazy(() => import("../page/subscriber")));
const ReviewManageList = Loadable(lazy(() => import("../page/review")));
const CountryManageList = Loadable(lazy(() => import("../page/country")));
const RecommendationManageList = Loadable(
  lazy(() => import("../page/recommendation"))
);
const NotFound = Loadable(lazy(() => import("../page/404/index")));
