import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { Button, Space, Typography } from "antd"

export default function SubscriberListHeader({
  onRefresh,
  onAddSubscriber,
  loading,
}: {
  onRefresh: () => void
  onAddSubscriber: () => void
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
        Subscriber Management
      </Typography.Title>
      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddSubscriber}
          loading={loading}
        >
          Add Subscriber
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
