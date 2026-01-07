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
  onAddJob: () => void
  onRefresh: () => void
  loading: boolean
}

const JobListHeader: React.FC<Props> = ({ onAddJob, onRefresh, loading }) => {
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
            href: PATH_DASHBOARD.jobManage.list,
            icon: <HomeOutlined />,
          },
          {
            label: BREADCRUMB.LIST_JOB,
            href: PATH_DASHBOARD.jobManage.list,
            icon: <BankOutlined />,
          },
        ]}
      />

      <Space>
        <Button
          type="primary"
          style={{ outline: "none" }}
          icon={<PlusOutlined />}
          onClick={onAddJob}
        >
          New Job
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

export default JobListHeader
