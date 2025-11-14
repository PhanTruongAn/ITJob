import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import type { TableColumnsType } from "antd"
import { Button, Dropdown, Tag } from "antd"
import { ICompany } from "../../../../types/backend"
import { ECompanyType } from "../../../../types/enum"
import {
  COMPANY_SIZE,
  COMPANY_STATUS,
  companyTypeColorMap,
} from "../../common/constants"

export const companyColumns = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView?: (user: ICompany) => void
  onEdit?: (user: ICompany) => void
  onDelete?: (id: number) => void
}): TableColumnsType<ICompany> => [
  {
    title: "ID",
    dataIndex: "id",
    ellipsis: true,
    width: "5%",
    sorter: true,
  },
  {
    title: "Name",
    dataIndex: "name",
    // width: "15%",
    ellipsis: true,
    sorter: true,
  },
  {
    title: "Company Type",
    dataIndex: "companyType",
    width: "15%",
    ellipsis: true,
    sorter: true,
    render: (type: string) => {
      const displayType =
        ECompanyType[type as keyof typeof ECompanyType] || type
      const color = companyTypeColorMap[type] || "default"
      return <Tag color={color}>{displayType}</Tag>
    },
  },
  // {
  //   title: "Address",
  //   dataIndex: "address",
  //   ellipsis: true,
  // },
  {
    title: "Industry",
    dataIndex: "industry",
    ellipsis: true,
  },
  {
    title: "Company Size",
    dataIndex: "companySize",
    width: "13%",
    ellipsis: true,
    render: (size: string) => {
      const company = COMPANY_SIZE.find((item) => item.value === size)

      return (
        <Tag color={company?.color || "default"}>{company?.label || size}</Tag>
      )
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    width: "13%",
    ellipsis: true,
    render: (size: string) => {
      const company = COMPANY_STATUS.find((item) => item.value === size)

      return (
        <Tag color={company?.color || "default"}>{company?.value || size}</Tag>
      )
    },
  },
  // {
  //   title: "CreatedAt",
  //   dataIndex: "createdAt",
  //   width: "10%",
  //   sorter: true,
  //   ellipsis: true,
  //   render: (text: string | null) =>
  //     text ? dayjs(text).format("DD/MM/YYYY") : "",
  // },
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
