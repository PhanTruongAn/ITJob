import { DeleteOutlined, EllipsisOutlined } from "@ant-design/icons"
import { Button, Dropdown, TableColumnsType, Rate } from "antd"
import { ICompanyReview } from "../../../../types/backend"

interface ReviewColumnsParams {
  onDelete: (record: ICompanyReview) => void
}

export const reviewColumns = ({
  onDelete,
}: ReviewColumnsParams): TableColumnsType<ICompanyReview> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "10%",
  },
  {
    title: "Company ID",
    dataIndex: "companyId",
    key: "companyId",
    width: "10%",
  },
  {
    title: "Rating",
    dataIndex: "rating",
    key: "rating",
    width: "20%",
    render: (val: number) => <Rate disabled defaultValue={val} />
  },
  {
    title: "Content",
    dataIndex: "content",
    key: "content",
    width: "50%",
  },
  {
    title: "Option",
    width: 80,
    render: (record) => {
      const menu = {
        items: [
          {
            key: "delete",
            icon: <DeleteOutlined />,
            label: "Delete",
            danger: true,
          },
        ],
        onClick: ({ key }: { key: string }) => {
          if (key === "delete") onDelete?.(record)
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
