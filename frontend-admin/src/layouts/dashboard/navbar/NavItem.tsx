import {
  ApiOutlined,
  BankOutlined,
  ContactsOutlined,
  DeploymentUnitOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BREADCRUMB } from "../../../constants/Breadcrumb";
import { PATH_DASHBOARD } from "../../../routes/paths";
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
];

export default navItems;
