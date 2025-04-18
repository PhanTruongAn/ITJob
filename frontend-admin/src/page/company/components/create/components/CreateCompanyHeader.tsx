import React, { useState } from "react";

import { HomeOutlined, BankOutlined, PlusOutlined } from "@ant-design/icons";
import CustomBreadcrumbs from "../../../../../components/CustomBreadScrumb";
import { BREADCRUMB } from "../../../../../constants/Breadcrumb";
import { PATH_DASHBOARD } from "../../../../../routes/paths";

type Props = {};

const CreateCompanyHeader: React.FC<Props> = ({}) => {
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
          {
            label: BREADCRUMB.CREATE_COMPANY,
            href: PATH_DASHBOARD.companyManage.create,
            icon: <PlusOutlined />,
          },
        ]}
      />
    </div>
  );
};

export default CreateCompanyHeader;
