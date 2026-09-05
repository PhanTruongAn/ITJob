import {
  ApiOutlined,
  BarChartOutlined,
  BankOutlined,
  ContactsOutlined,
  DeploymentUnitOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import { BREADCRUMB } from "../../../constants/Breadcrumb"
import { PATH_DASHBOARD } from "../../../routes/paths"

export const useNavItems = () => {
  const { t } = useTranslation()
  return [
    {
      key: "user-group",
      icon: <UserOutlined />,
      label: t("admin.users", BREADCRUMB.USER),
      children: [
        {
          icon: <UserOutlined />,
          label: t("admin.users", BREADCRUMB.LIST_USER),
          key: PATH_DASHBOARD.userManage.list,
        },
      ],
    },
    {
      key: "company-group",
      icon: <BankOutlined />,
      label: t("admin.companies", BREADCRUMB.COMPANY),
      children: [
        {
          icon: <BankOutlined />,
          label: t("admin.companies", BREADCRUMB.LIST_COMPANY),
          key: PATH_DASHBOARD.companyManage.list,
        },
      ],
    },
    {
      icon: <ScheduleOutlined />,
      label: t("admin.jobs", BREADCRUMB.JOB),
      key: PATH_DASHBOARD.jobManage.list,
    },
    {
      icon: <ContactsOutlined />,
      label: t("admin.resumes", BREADCRUMB.RESUME),
      key: PATH_DASHBOARD.resumeManage.list,
    },
    {
      icon: <DeploymentUnitOutlined />,
      label: t("admin.roles", BREADCRUMB.ROLE),
      key: PATH_DASHBOARD.roleManage.list,
    },
    {
      icon: <ApiOutlined />,
      label: t("admin.permissions", BREADCRUMB.PERMISSION),
      key: PATH_DASHBOARD.permissionManage.list,
    },
    {
      icon: <DeploymentUnitOutlined />,
      label: t("admin.skills", BREADCRUMB.SKILL),
      key: PATH_DASHBOARD.skillManage.list,
    },
    {
      icon: <ContactsOutlined />,
      label: t("admin.subscribers", BREADCRUMB.SUBSCRIBER),
      key: PATH_DASHBOARD.subscriberManage.list,
    },
    {
      icon: <ScheduleOutlined />,
      label: t("admin.reviews", BREADCRUMB.REVIEW),
      key: PATH_DASHBOARD.reviewManage.list,
    },
    {
      icon: <BankOutlined />,
      label: t("admin.countries", BREADCRUMB.COUNTRY),
      key: PATH_DASHBOARD.countryManage.list,
    },
    {
      icon: <ScheduleOutlined />,
      label: t("admin.recommendations", BREADCRUMB.RECOMMENDATION),
      key: PATH_DASHBOARD.recommendationManage.list,
    },
    {
      icon: <BarChartOutlined />,
      label: t("admin.emailAnalytics", BREADCRUMB.EMAIL_ANALYTICS),
      key: PATH_DASHBOARD.emailAnalytics.list,
    },
  ]
}

const navItems: any = [
  {
    icon: <UserOutlined />,
    label: BREADCRUMB.USER,
    children: [
      {
        icon: <UserOutlined />,
        label: BREADCRUMB.LIST_USER,
        key: PATH_DASHBOARD.userManage.list,
      },
    ],
  },
  {
    icon: <BankOutlined />,
    label: BREADCRUMB.COMPANY,
    children: [
      {
        icon: <BankOutlined />,
        label: BREADCRUMB.LIST_COMPANY,
        key: PATH_DASHBOARD.companyManage.list,
      },
    ],
  },
  {
    icon: <ScheduleOutlined />,
    label: BREADCRUMB.JOB,
    key: PATH_DASHBOARD.jobManage.list,
  },
  {
    icon: <ContactsOutlined />,
    label: BREADCRUMB.RESUME,
    key: PATH_DASHBOARD.resumeManage.list,
  },
  {
    icon: <DeploymentUnitOutlined />,
    label: BREADCRUMB.ROLE,
    key: PATH_DASHBOARD.roleManage.list,
  },
  {
    icon: <ApiOutlined />,
    label: BREADCRUMB.PERMISSION,
    key: PATH_DASHBOARD.permissionManage.list,
  },
  {
    icon: <DeploymentUnitOutlined />,
    label: BREADCRUMB.SKILL,
    key: PATH_DASHBOARD.skillManage.list,
  },
  {
    icon: <ContactsOutlined />,
    label: BREADCRUMB.SUBSCRIBER,
    key: PATH_DASHBOARD.subscriberManage.list,
  },
  {
    icon: <ScheduleOutlined />,
    label: BREADCRUMB.REVIEW,
    key: PATH_DASHBOARD.reviewManage.list,
  },
  {
    icon: <BankOutlined />,
    label: BREADCRUMB.COUNTRY,
    key: PATH_DASHBOARD.countryManage.list,
  },
  {
    icon: <ScheduleOutlined />,
    label: BREADCRUMB.RECOMMENDATION,
    key: PATH_DASHBOARD.recommendationManage.list,
  },
  {
    icon: <BarChartOutlined />,
    label: BREADCRUMB.EMAIL_ANALYTICS,
    key: PATH_DASHBOARD.emailAnalytics.list,
  },
]

export default navItems
