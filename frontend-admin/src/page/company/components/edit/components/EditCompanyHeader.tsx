import React from "react";

import { BankOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons";
import CustomBreadcrumbs from "../../../../../components/CustomBreadScrumb";
import { BREADCRUMB } from "../../../../../constants/Breadcrumb";
import { PATH_DASHBOARD } from "../../../../../routes/paths";

const EditCompanyHeader: React.FC = () => {
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
            label: BREADCRUMB.EDIT_COMPANY,
            href: PATH_DASHBOARD.companyManage.edit,
            icon: <EditOutlined />,
          },
        ]}
      />
    </div>
  );
};

export default EditCompanyHeader;
