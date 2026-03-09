import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EllipsisOutlined, EyeOutlined, SyncOutlined } from "@ant-design/icons"
import { Button, Dropdown, TableColumnsType, Tag } from "antd"
import { IResume } from "../../../../types/backend"

interface ResumeColumnsParams {
  onView: (record: IResume) => void
  onApprove: (record: IResume) => void
  onReview: (record: IResume) => void
  onReject: (record: IResume) => void
  onDelete: (record: IResume) => void
}

export const resumeColumns = ({
  onView,
  onApprove,
  onReview,
  onReject,
  onDelete,
}: ResumeColumnsParams): TableColumnsType<IResume> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "5%",
  },
  {
    title: "Candidate",
    key: "candidate",
    width: "15%",
    render: (_, record: IResume) => (
      <div>
        <div>{record.candidateName}</div>
        <div style={{ fontSize: 12, color: "gray" }}>{record.email}</div>
        <div style={{ fontSize: 12, color: "gray" }}>{record.phoneNumber}</div>
      </div>
    )
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "15%",
    render: (status: string) => {
      let color = "default"
      if (status === "PENDING") color = "gold"
      if (status === "REVIEWING") color = "blue"
      if (status === "APPROVED") color = "green"
      if (status === "REJECTED") color = "red"
      return <Tag color={color}>{status}</Tag>
    }
  },
  {
    title: "Job ID",
    dataIndex: "jobId",
    key: "jobId",
    width: "10%",
  },
  {
    title: "Note",
    dataIndex: "note",
    key: "note",
    width: "25%",
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
            label: "View Resume URL",
          },
          {
            key: "review",
            icon: <SyncOutlined />,
            label: "Mark as Reviewing",
            disabled: record.status !== "PENDING"
          },
          {
            key: "approve",
            icon: <CheckCircleOutlined />,
            label: "Approve",
            disabled: record.status === "APPROVED" || record.status === "REJECTED"
          },
          {
            key: "reject",
            icon: <CloseCircleOutlined />,
            label: "Reject",
            disabled: record.status === "APPROVED" || record.status === "REJECTED"
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
          else if (key === "review") onReview?.(record)
          else if (key === "approve") onApprove?.(record)
          else if (key === "reject") onReject?.(record)
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
