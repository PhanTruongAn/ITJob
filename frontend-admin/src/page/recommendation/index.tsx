import {
  DeleteOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons"
import {
  Button,
  Card,
  Checkbox,
  Form,
  InputNumber,
  Popconfirm,
  Select,
  Slider,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  TimePicker,
  Typography,
  message,
} from "antd"
import dayjs from "dayjs"
import React, { useEffect } from "react"
import {
  fetchJobRecommendations,
  fetchRecommendationConfig,
  updateRecommendationConfig,
} from "../../apis/recommendationModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../common/queryKeys"
import { IJobRecommendation } from "../../types/backend"
import { RECOMMENDATION_STATUS, STATUS_COLORS } from "./common/constants"
import {
  useDeleteRecommendation,
  useGenerateRecommendations,
  useRecommendationState,
  useUpdateRecommendationStatus,
} from "./common/hooks"

const { Title, Text } = Typography

const RecommendationPage: React.FC = () => {
  const { state, updateState } = useRecommendationState()
  const [form] = Form.useForm()

  const { mutate: generateMutate, isPending: isGenerating } =
    useGenerateRecommendations()
  const { mutate: updateStatusMutate } = useUpdateRecommendationStatus()
  const { mutate: deleteMutate } = useDeleteRecommendation()

  // Fetch History Data
  const { data: historyData, isLoading: isLoadingHistory } = CustomHooks.useQuery(
    [QUERY_KEYS.RECOMMENDATION_MODULE, "history", state.page, state.pageSize],
    () =>
      fetchJobRecommendations({ page: state.page, pageSize: state.pageSize }),
  )

  // Fetch Config Data
  const { data: configData, refetch: refetchConfig } = CustomHooks.useQuery(
    [QUERY_KEYS.RECOMMENDATION_MODULE, "config"],
    fetchRecommendationConfig,
  )

  useEffect(() => {
    if (historyData) {
      updateState({ total: historyData.data.meta.total })
    }
  }, [historyData])

  useEffect(() => {
    if (configData?.data) {
      const { cronExpression, ...rest } = configData.data
      // Extract time from cron expression (assuming format "0 mm HH * * ?")
      const parts = cronExpression.split(" ")
      const time = dayjs().set("hour", parseInt(parts[2])).set("minute", parseInt(parts[1]))
      
      form.setFieldsValue({
        ...rest,
        time,
      })
    }
  }, [configData, form])

  const { mutate: updateConfigMutate, isPending: isUpdatingConfig } =
    CustomHooks.useMutation(updateRecommendationConfig, {
      onSuccess: () => {
        message.success("Configuration updated successfully")
        refetchConfig()
      },
    })

  const onFinish = (values: any) => {
    const { time, ...rest } = values
    const cronExpression = `0 ${time.minute()} ${time.hour()} * * ?`
    updateConfigMutate({ ...rest, cronExpression })
  }

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
      title: "Subscriber Email",
      dataIndex: "subscriberEmail",
      key: "subscriberEmail",
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

  const items = [
    {
      key: "config",
      label: "Engine Configuration",
      children: (
        <div style={{ maxWidth: 800, marginTop: 20 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              isEnabled: true,
              maxJobsPerSubscriber: 10,
              minMatchPercentage: 60,
              onlyLast24h: true,
              time: dayjs().set("hour", 20).set("minute", 45),
            }}
          >
            <Card title="Scheduling Settings" size="small" style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
                <Form.Item
                  label="Execution Time (Daily)"
                  name="time"
                  rules={[{ required: true, message: "Please select time!" }]}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>

                <Form.Item label="Automatic Scheduler" name="isEnabled" valuePropName="checked">
                  <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                </Form.Item>
              </div>
            </Card>

            <Card title="Recommendation Logic" size="small" style={{ marginBottom: 20 }}>
              <Form.Item
                label="Minimum Skill Match Percentage"
                name="minMatchPercentage"
                help="A job will only be recommended if the subscriber has at least this percentage of the required skills."
              >
                <Slider
                  min={0}
                  max={100}
                  marks={{ 0: "0%", 60: "60%", 100: "100%" }}
                  tooltip={{ formatter: (v) => `${v}%` }}
                />
              </Form.Item>

              <Form.Item name="onlyLast24h" valuePropName="checked">
                <Checkbox>Only recommend jobs posted within the last 24 hours</Checkbox>
              </Form.Item>

              <Form.Item
                label="Maximum Job Recommendations per Subscriber (per run)"
                name="maxJobsPerSubscriber"
              >
                <InputNumber min={1} max={100} style={{ width: 200 }} />
              </Form.Item>
            </Card>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isUpdatingConfig}
                size="large"
              >
                Save All Settings
              </Button>
            </Form.Item>
          </Form>

          <Card
            title="Manual Performance Control"
            size="small"
            style={{ marginTop: 40, background: "#f5f5f5", border: "1px dashed #d9d9d9" }}
          >
            <Text type="secondary">
              Note: Generation is processed in batches of 50 subscribers to optimize database performance.
            </Text>
            <div style={{ marginTop: 15 }}>
              <Button
                type="default"
                icon={<ReloadOutlined />}
                loading={isGenerating}
                onClick={() => generateMutate()}
              >
                Trigger Manual Run Now
              </Button>
            </div>
          </Card>
        </div>
      ),
    },
    {
      key: "history",
      label: "Recommendation History",
      children: (
        <Table
          columns={columns}
          dataSource={historyData?.data.result || []}
          loading={isLoadingHistory}
          rowKey="id"
          pagination={{
            current: state.page,
            pageSize: state.pageSize,
            total: state.total,
            onChange: (page, pageSize) => updateState({ page, pageSize }),
            showSizeChanger: true,
          }}
        />
      ),
    },
  ]

  return (
    <Card bordered={false}>
      <Title level={3}>Job Recommendation Engine Manager</Title>
      <Tabs defaultActiveKey="config" items={items} />
    </Card>
  )
}

export default RecommendationPage
