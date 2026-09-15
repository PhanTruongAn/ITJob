import {
  DeleteOutlined,
  EllipsisOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import { Button, Dropdown, TableColumnsType, Tag, Tooltip } from "antd"
import { ICompanyReview } from "../../../../types/backend"

interface ReviewColumnsParams {
  onDelete: (record: ICompanyReview) => void
  onToggleHide: (record: ICompanyReview) => void
  onViewDetail: (record: ICompanyReview) => void
}

export const reviewColumns = ({
  onDelete,
  onToggleHide,
  onViewDetail,
}: ReviewColumnsParams): TableColumnsType<ICompanyReview> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 70,
    align: "center",
  },
  {
    title: "Company ID",
    dataIndex: "companyId",
    key: "companyId",
    width: 100,
    align: "center",
  },
  {
    title: "Company Name",
    dataIndex: "companyName",
    key: "companyName",
    width: 180,
    ellipsis: true,
    render: (val: string) => val || "-",
  },
  {
    title: "User Name",
    dataIndex: "userName",
    key: "userName",
    width: 140,
    ellipsis: true,
    render: (val: string) => val || "Ẩn danh",
  },
  {
    title: "Rating",
    dataIndex: "rating",
    key: "rating",
    width: 110,
    align: "center",
    render: (val: number) => (
      <Tag color="gold" style={{ fontWeight: 600, fontSize: "13px" }}>
        ⭐ {val ? `${val} sao` : "N/A"}
      </Tag>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "hidden",
    key: "hidden",
    width: 110,
    align: "center",
    render: (hidden: boolean) =>
      hidden ? (
        <Tag color="red">Đã ẩn</Tag>
      ) : (
        <Tag color="green">Hiển thị</Tag>
      ),
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    render: (_, record) => {
      const text = record.comment || record.content || "-"
      return (
        <Tooltip title="Click để xem chi tiết comment">
          <span
            onClick={() => onViewDetail(record)}
            style={{
              cursor: "pointer",
              color: "#1890ff",
              display: "inline-block",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        </Tooltip>
      )
    },
  },
  {
    title: "Option",
    width: 90,
    align: "center",
    render: (record) => {
      const menu = {
        items: [
          {
            key: "view",
            icon: <EyeOutlined />,
            label: "Xem chi tiết",
          },
          {
            key: "toggle",
            icon: record.hidden ? <EyeOutlined /> : <EyeInvisibleOutlined />,
            label: record.hidden ? "Hiện comment" : "Ẩn comment",
          },
          {
            key: "delete",
            icon: <DeleteOutlined />,
            label: "Xóa comment",
            danger: true,
          },
        ],
        onClick: ({ key }: { key: string }) => {
          if (key === "view") onViewDetail?.(record)
          if (key === "toggle") onToggleHide?.(record)
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

