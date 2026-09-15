import {
  ApiOutlined,
  BankOutlined,
  BarChartOutlined,
  ContactsOutlined,
  DeploymentUnitOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import { BREADCRUMB } from "../../../constants/Breadcrumb"
import { useAppSelector } from "../../../redux/hooks"
import { PATH_DASHBOARD } from "../../../routes/paths"

export interface NavItemType {
  key: string
  label: string
  icon?: React.ReactNode
  roles?: string[]
  children?: NavItemType[]
}

export const useNavItems = () => {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.account.user)
  const userRole = user?.role?.name || ""

  const rawNavItems: NavItemType[] = [
    {
      key: "user-group",
      icon: <UserOutlined />,
      label: t("admin.users", BREADCRUMB.USER),
      roles: ["ADMIN", "MANAGER"],
      children: [
        {
          icon: <UserOutlined />,
          label: t("admin.users", BREADCRUMB.LIST_USER),
          key: PATH_DASHBOARD.userManage.list,
          roles: ["ADMIN", "MANAGER"],
        },
      ],
    },
    {
      key: "company-group",
      icon: <BankOutlined />,
      label: t("admin.companies", BREADCRUMB.COMPANY),
      roles: ["ADMIN", "MANAGER", "EMPLOYER"],
      children: [
        {
          icon: <BankOutlined />,
          label: t("admin.companies", BREADCRUMB.LIST_COMPANY),
          key: PATH_DASHBOARD.companyManage.list,
          roles: ["ADMIN", "MANAGER", "EMPLOYER"],
        },
      ],
    },
    {
      icon: <ScheduleOutlined />,
      label: t("admin.jobs", BREADCRUMB.JOB),
      key: PATH_DASHBOARD.jobManage.list,
      roles: ["ADMIN", "MANAGER", "EMPLOYER"],
    },
    {
      icon: <ContactsOutlined />,
      label: t("admin.resumes", BREADCRUMB.RESUME),
      key: PATH_DASHBOARD.resumeManage.list,
      roles: ["ADMIN", "MANAGER", "EMPLOYER"],
    },
    {
      icon: <DeploymentUnitOutlined />,
      label: t("admin.roles", BREADCRUMB.ROLE),
      key: PATH_DASHBOARD.roleManage.list,
      roles: ["ADMIN"],
    },
    {
      icon: <ApiOutlined />,
      label: t("admin.permissions", BREADCRUMB.PERMISSION),
      key: PATH_DASHBOARD.permissionManage.list,
      roles: ["ADMIN"],
    },
    {
      icon: <DeploymentUnitOutlined />,
      label: t("admin.skills", BREADCRUMB.SKILL),
      key: PATH_DASHBOARD.skillManage.list,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      icon: <ContactsOutlined />,
      label: t("admin.subscribers", BREADCRUMB.SUBSCRIBER),
      key: PATH_DASHBOARD.subscriberManage.list,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      icon: <ScheduleOutlined />,
      label: t("admin.reviews", BREADCRUMB.REVIEW),
      key: PATH_DASHBOARD.reviewManage.list,
      roles: ["ADMIN", "MANAGER", "EMPLOYER"],
    },
    {
      icon: <BankOutlined />,
      label: t("admin.countries", BREADCRUMB.COUNTRY),
      key: PATH_DASHBOARD.countryManage.list,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      icon: <ScheduleOutlined />,
      label: t("admin.recommendations", BREADCRUMB.RECOMMENDATION),
      key: PATH_DASHBOARD.recommendationManage.list,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      icon: <BarChartOutlined />,
      label: t("admin.emailAnalytics", BREADCRUMB.EMAIL_ANALYTICS),
      key: PATH_DASHBOARD.emailAnalytics.list,
      roles: ["ADMIN", "MANAGER"],
    },
  ]

  const filterByRole = (items: NavItemType[]): NavItemType[] => {
    return items
      .map((item) => {
        if (item.roles && !item.roles.includes(userRole)) {
          return null
        }

        if (item.children && item.children.length > 0) {
          const filteredChildren = filterByRole(item.children)
          if (filteredChildren.length === 0) return null
          return { ...item, children: filteredChildren }
        }

        return item
      })
      .filter(Boolean) as NavItemType[]
  }

  return filterByRole(rawNavItems)
}

export default useNavItems
