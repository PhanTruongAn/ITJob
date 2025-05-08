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
];

export default navItems;
