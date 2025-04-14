import {
  BankOutlined,
  UserOutlined,
  ApiOutlined,
  ContactsOutlined,
  ScheduleOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { BREADCRUMB } from "../../../constants/Breadcrumb";
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
    key: PATH_DASHBOARD.companyManage.list,
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
