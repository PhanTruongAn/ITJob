import React, { useState } from "react";
import { BREADCRUMB } from "../../../constants/Breadcrumb";
import { PATH_DASHBOARD } from "../../../routes/paths";
import CustomBreadcrumbs from "../../../components/CustomBreadScrumb";
import {
  HomeOutlined,
  BankOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";

type Props = {
  onAddCompany: () => void;
  onRefresh: () => void;
  loading: boolean;
};

const CompanyListHeader: React.FC<Props> = ({
  onAddCompany,
  onRefresh,
  loading,
}) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
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
            href: PATH_DASHBOARD.companyManage.list,
            icon: <HomeOutlined />,
          },
          {
            label: BREADCRUMB.LIST_COMPANY,
            href: PATH_DASHBOARD.companyManage.list,
            icon: <BankOutlined />,
          },
        ]}
      />

      <Space className="table-button-group">
        <Button
          type="primary"
          icon={<PlusOutlined style={{ fontSize: "16px" }} />}
          onClick={onAddCompany}
        >
          Add Company
        </Button>
        <Button
          color="cyan"
          variant="outlined"
          onClick={onRefresh}
          loading={loading}
          icon={<ReloadOutlined style={{ fontSize: "16px" }} />}
        >
          Refresh
        </Button>
      </Space>
    </div>
  );
};

export default CompanyListHeader;
