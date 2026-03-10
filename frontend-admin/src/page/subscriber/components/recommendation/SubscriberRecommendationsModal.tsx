import { DeleteOutlined } from "@ant-design/icons"
import {
  Button,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd"
import React, { useEffect, useState } from "react"
import {
  deleteRecommendation,
  fetchJobRecommendations,
  updateRecommendationStatus,
} from "../../../../apis/recommendationModule"
import CustomHooks from "../../../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../../../common/queryKeys"
import { IJobRecommendation, ISubscriber } from "../../../../types/backend"
import {
  RECOMMENDATION_STATUS,
  STATUS_COLORS,
} from "../../../recommendation/common/constants"

const { Title } = Typography

interface SubscriberRecommendationsModalProps {
  open: boolean
  subscriber: ISubscriber | undefined
  onCancel: () => void
}

const SubscriberRecommendationsModal: React.FC<
  SubscriberRecommendationsModalProps
> = ({ open, subscriber, onCancel }) => {
  const [state, setState] = useState({
    page: 1,
    pageSize: 5,
    total: 0,
  })

  const { data, isLoading, refetch } = CustomHooks.useQuery(
    [
      QUERY_KEYS.RECOMMENDATION_MODULE,
      subscriber?.id,
      state.page,
      state.pageSize,
    ],
    () =>
      fetchJobRecommendations({
        page: state.page + 1,
        pageSize: state.pageSize,
        subscriberId: subscriber?.id,
      }),
    {
      enabled: !!subscriber && open,
    },
  )

  useEffect(() => {
    if (data) {
      setState((prev) => ({ ...prev, total: data.data.meta.total || 0 }))
    }
  }, [data])

  const { mutate: updateStatusMutate } = CustomHooks.useMutation(
    ({ id, status }: { id: number; status: string }) =>
      updateRecommendationStatus(id, status),
    {
      onSuccess: () => {
        message.success("Status updated successfully")
        refetch()
      },
    },
  )

  const { mutate: deleteMutate } = CustomHooks.useMutation(
    deleteRecommendation,
    {
      onSuccess: () => {
        message.success("Recommendation deleted successfully")
        refetch()
      },
    },
  )

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: IJobRecommendation) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) =>
            updateStatusMutate({ id: record.id, status: value })
          }
        >
          {Object.values(RECOMMENDATION_STATUS).map((s) => (
            <Select.Option key={s} value={s}>
              <Tag color={STATUS_COLORS[s]}>{s}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: any) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_: any, record: IJobRecommendation) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this recommendation?"
            onConfirm={() => deleteMutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Modal
      title={`Job Recommendations for ${subscriber?.email}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <Table
        columns={columns}
        dataSource={data?.data.result || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: state.total,
          onChange: (page, pageSize) =>
            setState((prev) => ({ ...prev, page, pageSize })),
          showSizeChanger: true,
        }}
      />
    </Modal>
  )
}

export default SubscriberRecommendationsModal
