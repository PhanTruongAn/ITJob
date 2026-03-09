import { DeleteOutlined, EditOutlined, EllipsisOutlined } from "@ant-design/icons"
import { Button, Dropdown, TableColumnsType, Tag } from "antd"
import { IRole } from "../../../../types/backend"

interface RoleColumnsParams {
  onEdit: (record: IRole) => void
  onDelete: (record: IRole) => void
}

export const roleColumns = ({
  onEdit,
  onDelete,
}: RoleColumnsParams): TableColumnsType<IRole> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "10%",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: "25%",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: "25%",
  },
  {
    title: "Status",
    dataIndex: "active",
    key: "active",
    width: "15%",
    render: (active: boolean) => {
      return (
        <Tag color={active ? "green" : "red"}>
          {active ? "ACTIVE" : "INACTIVE"}
        </Tag>
      )
    }
  },
  {
    title: "Permissions Count",
    dataIndex: "permissions",
    key: "permissions",
    width: "15%",
    render: (permissions: any[]) => {
      return <span>{permissions?.length || 0} permissions</span>
    }
  },
  {
    title: "Option",
    width: 80,
    render: (record) => {
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
