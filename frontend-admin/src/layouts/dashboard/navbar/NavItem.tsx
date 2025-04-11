import {
  BankOutlined,
  UserOutlined,
  ApiOutlined,
  ContactsOutlined,
  ScheduleOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { PATH_DASHBOARD } from "../../../routes/paths";
const navItems: any = [
  {
    icon: <UserOutlined />,
    label: <Link to={PATH_DASHBOARD.userManage.list}>User</Link>,
    key: PATH_DASHBOARD.userManage.list,
  },
  {
    icon: <BankOutlined />,
    label: <Link to={PATH_DASHBOARD.companyManage.list}>Company</Link>,
    key: PATH_DASHBOARD.companyManage.list,
  },
  {
    icon: <ScheduleOutlined />,
    label: <Link to={PATH_DASHBOARD.jobManage.list}>Job</Link>,
    key: PATH_DASHBOARD.jobManage.list,
  },
  {
    icon: <ContactsOutlined />,
    label: <Link to={PATH_DASHBOARD.resumeManage.list}>Resume</Link>,
    key: PATH_DASHBOARD.resumeManage.list,
  },
  {
    icon: <DeploymentUnitOutlined />,
    label: <Link to={PATH_DASHBOARD.roleManage.list}>Role</Link>,
    key: PATH_DASHBOARD.roleManage.list,
  },
  {
    icon: <ApiOutlined />,
    label: <Link to={PATH_DASHBOARD.permissionManage.list}>Permission</Link>,
    key: PATH_DASHBOARD.permissionManage.list,
  },
];

export default navItems;
