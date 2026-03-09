import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { Button, Space, Typography } from "antd"

export default function PermissionListHeader({
  onRefresh,
  onAddPermission,
  loading,
}: {
  onRefresh: () => void
  onAddPermission: () => void
  loading: boolean
}) {
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
      <Typography.Title level={4} style={{ margin: 0 }}>
        Permission Management
      </Typography.Title>
      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddPermission}
          loading={loading}
        >
          Add Permission
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
  )
}
