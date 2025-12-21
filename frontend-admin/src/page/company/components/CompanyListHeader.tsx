import {
  BankOutlined,
  HomeOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import { Button, Space } from "antd"
import React from "react"
import CustomBreadcrumbs from "../../../components/CustomBreadScrumb"
import { BREADCRUMB } from "../../../constants/Breadcrumb"
import { PATH_DASHBOARD } from "../../../routes/paths"

type Props = {
  onAddCompany: () => void
  onRefresh: () => void
  loading: boolean
}

const CompanyListHeader: React.FC<Props> = ({
  onAddCompany,
  onRefresh,
  loading,
}) => {
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

      <Space>
        <Button
          type="primary"
          style={{ outline: "none" }}
          icon={<PlusOutlined />}
          onClick={onAddCompany}
        >
          New Company
        </Button>
        <Button
          color="cyan"
          variant="outlined"
          onClick={onRefresh}
          loading={loading}
          style={{ outline: "none" }}
          icon={<ReloadOutlined style={{ outline: "none" }} />}
        >
          Refresh
        </Button>
      </Space>
    </div>
  )
}

export default CompanyListHeader
