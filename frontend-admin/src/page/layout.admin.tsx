import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AreaChartOutlined,
  BankOutlined,
  UserOutlined,
  ApiOutlined,
  ContactsOutlined,
  ScheduleOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, Link, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const LayoutAdmin: React.FC = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);
  return (
    <Layout style={{ padding: 0, height: "100vh", display: "flex" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <span
            style={{
              padding: "7px",
              fontSize: "21px",
              fontWeight: 500,
              color: "#3386D7",
              textShadow: "1px 1px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            Admin
          </span>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeMenu]}
          onClick={(e) => setActiveMenu(e.key)}
          items={[
            {
              icon: <AreaChartOutlined />,
              label: <Link to="/admin">Dashboard</Link>,
              key: "/admin",
            },
            {
              icon: <UserOutlined />,
              label: <Link to="/admin/user">User</Link>,
              key: "/admin/user",
            },
            {
              icon: <BankOutlined />,
              label: <Link to="/admin/company">Company</Link>,
              key: "/admin/company",
            },
            {
              icon: <ScheduleOutlined />,
              label: <Link to="/admin/job">Job</Link>,
              key: "/admin/job",
            },
            {
              icon: <ContactsOutlined />,
              label: <Link to="/admin/resume">Resume</Link>,
              key: "/admin/resume",
            },
            {
              icon: <DeploymentUnitOutlined />,
              label: <Link to="/admin/role">Role</Link>,
              key: "/admin/role",
            },
            {
              icon: <ApiOutlined />,
              label: <Link to="/admin/permission">Permission</Link>,
              key: "/admin/permission",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              border: "none",
              outline: "none",
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
