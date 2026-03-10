import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons"
import { Button, Dropdown, TableColumnsType, Tag } from "antd"
import { ISubscriber } from "../../../../types/backend"

interface SubscriberColumnsParams {
  onEdit: (record: ISubscriber) => void
  onDelete: (record: ISubscriber) => void
  onViewRecommendations: (record: ISubscriber) => void
}

export const subscriberColumns = ({
  onEdit,
  onDelete,
  onViewRecommendations,
}: SubscriberColumnsParams): TableColumnsType<ISubscriber> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "10%",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: "25%",
  },
  {
    title: "Skills Configured",
    dataIndex: "skills",
    key: "skills",
    render: (skills: any[]) => {
      if (!skills || skills.length === 0) return <span>None</span>
      return skills.map((s, index) => (
        <Tag color="geekblue" key={index} style={{ marginBottom: "4px" }}>
          {s.name}
        </Tag>
      ))
    },
  },
  {
    title: "Option",
    width: 80,
    render: (record) => {
      const menu = {
        items: [
          {
            key: "view-recommendations",
            icon: <EllipsisOutlined />,
            label: "View Recommendations",
          },
          {
            key: "edit",
            icon: <EditOutlined />,
            label: "Edit",
          },
          {
            key: "delete",
            icon: <DeleteOutlined />,
            label: "Delete",
            danger: true,
          },
        ],
        onClick: ({ key }: { key: string }) => {
          if (key === "edit") onEdit?.(record)
          else if (key === "delete") onDelete?.(record)
          else if (key === "view-recommendations") onViewRecommendations?.(record)
        },
      }

      return (
        <Dropdown menu={menu} trigger={["click"]}>
          <Button
            shape="circle"
            icon={<EllipsisOutlined />}
            style={{ border: "none", outline: "none" }}
          />
        </Dropdown>
      )
    },
  },
]
