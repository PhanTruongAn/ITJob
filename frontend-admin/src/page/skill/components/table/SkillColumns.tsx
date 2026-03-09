import { DeleteOutlined, EditOutlined, EllipsisOutlined } from "@ant-design/icons"
import { Button, Dropdown, TableColumnsType } from "antd"
import { ISkill } from "../../../../types/backend"

interface UserColumnsParams {
  onEdit: (record: ISkill) => void
  onDelete: (record: ISkill) => void
}

export const skillColumns = ({
  onEdit,
  onDelete,
}: UserColumnsParams): TableColumnsType<ISkill> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "10%",
  },
  {
    title: "Mã kỹ năng",
    dataIndex: "name",
    key: "name",
    width: "70%",
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
          if (key === "edit") onEdit?.(record);
          else if (key === "delete") onDelete?.(record);
        },
      };

      return (
        <Dropdown menu={menu} trigger={["click"]}>
          <Button
            shape="circle"
            icon={<EllipsisOutlined />}
            style={{ border: "none", outline: "none" }}
          />
        </Dropdown>
      );
    },
  },
]
