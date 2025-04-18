import React, { useState } from "react";
import { BREADCRUMB } from "../../../constants/Breadcrumb";
import { PATH_DASHBOARD } from "../../../routes/paths";
import CustomBreadcrumbs from "../../../components/CustomBreadScrumb";
import {
  HomeOutlined,
  OrderedListOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";

type Props = {
  onAddUser: () => void;
  onRefresh: () => void;
  loading: boolean;
};

const UserListHeader: React.FC<Props> = ({ onAddUser, onRefresh, loading }) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <CustomBreadcrumbs
        items={[
          {
            label: BREADCRUMB.HOME,
            href: PATH_DASHBOARD.userManage.list,
            icon: <HomeOutlined />,
          },
          {
            label: BREADCRUMB.LIST_USER,
            href: PATH_DASHBOARD.userManage.list,
            icon: <OrderedListOutlined />,
          },
        ]}
      />

      <Space className="table-button-group">
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddUser}>
          Add User
        </Button>
        <Button
          color="cyan"
          variant="outlined"
          onClick={onRefresh}
          loading={loading}
          icon={<ReloadOutlined />}
        >
          Refresh
        </Button>
      </Space>
    </div>
  );
};

export default UserListHeader;
