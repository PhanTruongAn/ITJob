import { ElementType, lazy, Suspense } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { PATH_AUTH, PATH_DASHBOARD, ROOT_DASHBOARD } from "./paths";
import LayoutAdmin from "../layouts/layout.admin";
import AuthGuard from "../guards/AuthGuard";
import RoleGuard from "../guards/RoleGuard";
import { MANAGEMENT_ROLES, getManagementLandingPath } from "./paths";
import { useAppSelector } from "../redux/hooks";

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
  const roleName = useAppSelector((state) => state.account.user.role?.name)
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
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.userManage.list,
              element: <RoleGuard roles={["ADMIN", "MANAGER"]}><UserManageList /></RoleGuard>,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.companyManage.list,
              element: <RoleGuard roles={["ADMIN", "MANAGER", "EMPLOYER"]}><CompanyManageList /></RoleGuard>,
            },
            {
              path: PATH_DASHBOARD.companyManage.create,
              element: <RoleGuard roles={["ADMIN", "MANAGER", "EMPLOYER"]}><CompanyManageCreate /></RoleGuard>,
            },
            {
              path: PATH_DASHBOARD.companyManage.edit,
              element: <RoleGuard roles={["ADMIN", "MANAGER", "EMPLOYER"]}><CompanyManageEdit /></RoleGuard>,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.jobManage.list,
              element: <RoleGuard roles={["ADMIN", "MANAGER", "EMPLOYER"]}><JobManageList /></RoleGuard>,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.resumeManage.list,
              element: <RoleGuard roles={["ADMIN", "MANAGER", "EMPLOYER"]}><ResumeManageList /></RoleGuard>,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.roleManage.list,
              element: <RoleGuard roles={["ADMIN"]}><RoleManageList /></RoleGuard>,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.permissionManage.list,
              element: <RoleGuard roles={["ADMIN"]}><PermissionManageList /></RoleGuard>,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.skillManage.list,
              element: <RoleGuard roles={["ADMIN", "MANAGER"]}><SkillManageList /></RoleGuard>,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.subscriberManage.list,
              element: <RoleGuard roles={["ADMIN", "MANAGER"]}><SubscriberManageList /></RoleGuard>,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.reviewManage.list,
              element: <RoleGuard roles={["ADMIN", "MANAGER", "EMPLOYER"]}><ReviewManageList /></RoleGuard>,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.countryManage.list,
              element: <RoleGuard roles={["ADMIN", "MANAGER"]}><CountryManageList /></RoleGuard>,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.recommendationManage.list,
              element: <RoleGuard roles={["ADMIN", "MANAGER"]}><RecommendationManageList /></RoleGuard>,
            },
          ],
        },
        {
          path: "",
          children: [
            {
              element: <Navigate to={getManagementLandingPath(roleName) ?? PATH_AUTH.login} replace />,
              index: true,
            },
            {
              path: PATH_DASHBOARD.emailAnalytics.list,
              element: <RoleGuard roles={["ADMIN", "MANAGER"]}><EmailAnalyticsPage /></RoleGuard>,
            },
            {
              path: PATH_DASHBOARD.profile,
              element: <RoleGuard roles={MANAGEMENT_ROLES}><ProfilePage /></RoleGuard>,
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
const EmailAnalyticsPage = Loadable(lazy(() => import("../page/email-analytics")));
const ProfilePage = Loadable(lazy(() => import("../page/profile")));

