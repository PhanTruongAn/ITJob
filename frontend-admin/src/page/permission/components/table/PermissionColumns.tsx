import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons"
import { Button, Dropdown, TableColumnsType, Tag } from "antd"
import { IPermission } from "../../../../types/backend"

interface PermissionColumnsParams {
  onEdit: (record: IPermission) => void
  onDelete: (record: IPermission) => void
}

export const permissionColumns = ({
  onEdit,
  onDelete,
}: PermissionColumnsParams): TableColumnsType<IPermission> => [
  {
    title: "Resource",
    dataIndex: "resource",
    key: "resource",
    width: "15%",
    render: (resource: string, record: IPermission) => {
      if (
        typeof record.id === "string" &&
        String(record.id).startsWith("res-")
      ) {
        return <span style={{ fontWeight: 600, fontSize: 16 }}>{resource}</span>
      }
      return ""
    },
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "5%",
    render: (id: any) => {
      if (typeof id === "string" && id.startsWith("res-")) return ""
      return id
    },
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: "20%",
  },
  {
    title: "API Path",
    dataIndex: "apiPath",
    key: "apiPath",
    width: "25%",
  },
  {
    title: "Method",
    dataIndex: "method",
    key: "method",
    width: "10%",
    render: (method: string) => {
      if (!method) return ""
      let color = "default"
      if (method === "GET") color = "green"
      if (method === "POST") color = "blue"
      if (method === "PUT") color = "orange"
      if (method === "DELETE") color = "red"
      return <Tag color={color}>{method}</Tag>
    },
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: "10%",
    render: (action: string) => {
      if (!action) return ""
      return <Tag color="cyan">{action}</Tag>
    },
  },

  {
    title: "Option",
    width: 80,
    render: (record) => {
      // Hide options for group rows
      if (typeof record.id === "string" && String(record.id).startsWith("res-"))
        return null

      const menu = {
        items: [
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
