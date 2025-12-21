import React from "react"

import { BankOutlined, HomeOutlined, PlusOutlined } from "@ant-design/icons"
import CustomBreadcrumbs from "../../../../../components/CustomBreadScrumb"
import { BREADCRUMB } from "../../../../../constants/Breadcrumb"
import { PATH_DASHBOARD } from "../../../../../routes/paths"

type Props = {}

const EditJobHeader: React.FC<Props> = ({}) => {
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
            href: PATH_DASHBOARD.jobManage.list,
            icon: <HomeOutlined />,
          },
          {
            label: BREADCRUMB.LIST_JOB,
            href: PATH_DASHBOARD.jobManage.list,
            icon: <BankOutlined />,
          },
          {
            label: BREADCRUMB.EDIT_JOB,
            href: PATH_DASHBOARD.jobManage.edit,
            icon: <PlusOutlined />,
          },
        ]}
      />
    </div>
  )
}

export default EditJobHeader
