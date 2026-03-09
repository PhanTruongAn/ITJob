import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { Button, Space, Typography } from "antd"

export default function SkillListHeader({
  onRefresh,
  onAddSkill,
  loading,
}: {
  onRefresh: () => void
  onAddSkill: () => void
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
        Skill Management
      </Typography.Title>
      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddSkill}
          loading={loading}
        >
          Add Skill
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
