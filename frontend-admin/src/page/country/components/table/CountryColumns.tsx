import { DeleteOutlined, EditOutlined, EllipsisOutlined } from "@ant-design/icons"
import { Button, Dropdown, TableColumnsType } from "antd"
import { ICountry } from "../../../../types/backend"

interface CountryColumnsParams {
  onEdit: (record: ICountry) => void
  onDelete: (record: ICountry) => void
}

export const countryColumns = ({
  onEdit,
  onDelete,
}: CountryColumnsParams): TableColumnsType<ICountry> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "10%",
  },
  {
    title: "Country Code",
    dataIndex: "code",
    key: "code",
    width: "30%",
  },
  {
    title: "Country Name",
    dataIndex: "name",
    key: "name",
    width: "40%",
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
