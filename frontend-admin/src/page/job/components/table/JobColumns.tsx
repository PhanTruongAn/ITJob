import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import type { TableColumnsType } from "antd"
import { Button, Dropdown, Tag } from "antd"
import { levelColorMap } from "../../common/constants"
import { LevelEnum } from "../../common/enums"
import { Job } from "../../common/interfaces"

export const JobColumns = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView?: (job: Job) => void
  onEdit?: (job: Job) => void
  onDelete?: (id: number) => void
}): TableColumnsType<Job> => [
  {
    title: "ID",
    dataIndex: "id",
    ellipsis: true,
    width: "5%",
    sorter: true,
  },
  {
    title: "Job Name",
    dataIndex: "name",
    width: "20%",
    ellipsis: true,
    sorter: true,
  },
  {
    title: "Company Name",
    dataIndex: "companyId",
    ellipsis: true,
  },
  {
    title: "Salary Range",
    dataIndex: "salary",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "Location",
    dataIndex: "location",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "Job Level",
    dataIndex: "level",
    width: "10%",
    ellipsis: true,
    sorter: true,
    render: (type: string) => {
      const displayType = LevelEnum[type as keyof typeof LevelEnum] || type
      const color = levelColorMap[type] || "default"
      return <Tag color={color}>{displayType}</Tag>
    },
  },
  {
    title: "Job Status",
    dataIndex: "active",
    width: "10%",
    ellipsis: true,
    render: (type: string) => {
      const displayType = type ? "ACTIVE" : "INACTIVE"
      const color = type ? "green" : "red"
      return <Tag color={color}>{displayType}</Tag>
    },
  },
  {
    title: "Option",
    width: 80,
    render: (record) => {
      const menu = {
        items: [
          {
            key: "view",
            icon: <EyeOutlined />,
            label: "View detail",
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
          if (key === "view") onView?.(record)
          else if (key === "edit") onEdit?.(record)
          else if (key === "delete") onDelete?.(record.id)
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
