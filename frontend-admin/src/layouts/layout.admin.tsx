import React, { useState, useEffect } from "react";
import {
  Avatar,
  Badge,
  Button,
  Layout,
  Menu,
  Space,
  theme,
  Tooltip,
} from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import navItems from "./dashboard/navbar/NavItem";
import {
  NotificationOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../redux/hooks";
import CustomDropdown from "../components/CustomDropdown";
import { getDropdownItems } from "./constants";
import { useLogout } from "./hooks";

const { Header, Sider, Content } = Layout;

const LayoutAdmin: React.FC = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const userData = useAppSelector((state) => state.account.user);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { mutate } = useLogout();
  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  const handleNavigate = ({ key }: { key: string }) => {
    setActiveMenu(key);
    navigate(key);
  };
  const handleLogout = () => {
    mutate();
  };

  const items = getDropdownItems(undefined, undefined, handleLogout);
  return (
    <Layout
      style={{
        padding: 0,
        height: "100%",
        display: "flex",
        overflowX: "hidden",
      }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          zIndex: 100,
        }}
      >
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
          onClick={(key) => handleNavigate(key)}
          items={navItems}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "all 0.2s",
          minWidth: 0,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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

          <div style={{ marginRight: 30 }}>
            <Space size="middle">
              <Badge count={1} color="#ff686b" dot>
                <NotificationOutlined style={{ fontSize: 20 }} />
              </Badge>

              <Tooltip>
                <CustomDropdown
                  items={items}
                  triggerNode={
                    <Avatar
                      src={userData?.avatar}
                      style={{ backgroundColor: "#00b4d8", cursor: "pointer" }}
                      size="large"
                      shape="circle"
                      onClick={() => {
                        console.log("Avatar clicked");
                      }}
                    />
                  }
                />
              </Tooltip>
            </Space>
          </div>
        </Header>
        <Content
          style={{
            margin: "13px 16px",
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
