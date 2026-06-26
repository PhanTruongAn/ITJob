import {
  BulbOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Progress,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  TimePicker,
  Tooltip,
  Typography,
  message,
} from "antd"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"
import {
  fetchJobRecommendations,
  fetchRecommendationConfig,
  updateRecommendationConfig,
} from "../../apis/recommendationModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../common/queryKeys"
import { IJobRecommendation } from "../../types/backend"
import {
  RECOMMENDATION_STATUS,
  STATUS_COLORS,
  STATUS_LABELS,
} from "./common/constants"
import {
  useDeleteRecommendation,
  useFetchRecommendationDetail,
  useGenerateRecommendations,
  useRecommendationState,
  useUpdateEmailStatus,
} from "./common/hooks"

const { Title, Text, Paragraph } = Typography
const { RangePicker } = DatePicker

// ============================================================
// Detail Drawer
// ============================================================
const RecommendationDetailDrawer: React.FC<{
  id: number | null
  open: boolean
  onClose: () => void
}> = ({ id, open, onClose }) => {
  const { data, isLoading } = useFetchRecommendationDetail(id)
  const rec = data?.data

  return (
    <Drawer
      title={
        <Space>
          <InfoCircleOutlined />
          <span>Recommendation Detail</span>
          {rec && (
            <Tag color={STATUS_COLORS[rec.status]}>
              {STATUS_LABELS[rec.status]}
            </Tag>
          )}
        </Space>
      }
      width={520}
      open={open}
      onClose={onClose}
      loading={isLoading}
    >
      {rec && (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Subscriber */}
          <Card size="small" title="👤 Subscriber Information">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Email">
                {rec.subscriberEmail}
              </Descriptions.Item>
              <Descriptions.Item label="ID">
                #{rec.subscriberId}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Job */}
          <Card size="small" title="💼 Job Information">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Job Title">
                {rec.jobTitle}
              </Descriptions.Item>
              <Descriptions.Item label="Company">
                {rec.companyName}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Matching Result */}
          <Card
            size="small"
            title="🎯 Matching Result"
            extra={
              <Tag
                color={
                  rec.matchScore >= 80
                    ? "green"
                    : rec.matchScore >= 60
                      ? "orange"
                      : "red"
                }
              >
                {rec.matchScore?.toFixed(1)}%
              </Tag>
            }
          >
            <Progress
              percent={Math.round(rec.matchScore || 0)}
              strokeColor={
                rec.matchScore >= 80
                  ? "#52c41a"
                  : rec.matchScore >= 60
                    ? "#fa8c16"
                    : "#f5222d"
              }
              style={{ marginBottom: 12 }}
            />

            {rec.matchedSkills && rec.matchedSkills.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <Text strong>Matched Skills:</Text>
                <div style={{ marginTop: 6 }}>
                  {rec.matchedSkills.map((skill) => (
                    <Tag key={skill} color="blue" style={{ marginBottom: 4 }}>
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {rec.reason && (
              <div>
                <Text strong>Reason:</Text>
                <Paragraph
                  style={{ marginTop: 4, marginBottom: 0 }}
                  type="secondary"
                >
                  {rec.reason}
                </Paragraph>
              </div>
            )}
          </Card>

          {/* Status History */}
          <Card size="small" title="📋 Status & Timing">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Current Status">
                <Tag color={STATUS_COLORS[rec.status]}>
                  {STATUS_LABELS[rec.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(rec.createdAt).toLocaleString()}
              </Descriptions.Item>
              {rec.sentAt && (
                <Descriptions.Item label="Sent At">
                  {new Date(rec.sentAt).toLocaleString()}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Space>
      )}
    </Drawer>
  )
}

// ============================================================
// Filter Panel
// ============================================================
const FilterPanel: React.FC<{
  onSearch: (filters: any) => void
  onReset: () => void
}> = ({ onSearch, onReset }) => {
  const [form] = Form.useForm()

  const handleSearch = () => {
    const values = form.getFieldsValue()
    const filters: any = {
      keyword: values.keyword || undefined,
      status: values.status || undefined,
      minMatch: values.minMatch || undefined,
    }
    if (values.dateRange && values.dateRange.length === 2) {
      filters.fromDate = values.dateRange[0].toISOString()
      filters.toDate = values.dateRange[1].toISOString()
    }
    onSearch(filters)
  }

  const handleReset = () => {
    form.resetFields()
    onReset()
  }

  return (
    <Card
      size="small"
      style={{
        marginBottom: 16,
        background: "#fafafa",
        border: "1px solid #f0f0f0",
      }}
    >
      <Form form={form} layout="inline" style={{ gap: 8, flexWrap: "wrap" }}>
        <Form.Item name="keyword" style={{ marginBottom: 8 }}>
          <Input
            placeholder="Search email, job, company..."
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            allowClear
          />
        </Form.Item>

        <Form.Item name="status" style={{ marginBottom: 8 }}>
          <Select placeholder="Status" style={{ width: 130 }} allowClear>
            {Object.entries(RECOMMENDATION_STATUS).map(([, v]) => (
              <Select.Option key={v} value={v}>
                <Tag color={STATUS_COLORS[v]}>{STATUS_LABELS[v]}</Tag>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="dateRange" style={{ marginBottom: 8 }}>
          <RangePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: 350 }}
            placeholder={["From date", "To date"]}
          />
        </Form.Item>

        <Form.Item
          name="minMatch"
          label="Min Match%"
          style={{ marginBottom: 8 }}
        >
          <InputNumber min={0} max={100} style={{ width: 80 }} addonAfter="%" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }}>
          <Space>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={handleSearch}
            >
              Filter
            </Button>
            <Button onClick={handleReset}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

// ============================================================
// Recommendation History Tab
// ============================================================
const HistoryTab: React.FC = () => {
  const { state, updateState } = useRecommendationState()
  const { mutate: updateStatusMutate } = useUpdateEmailStatus()
  const { mutate: deleteMutate } = useDeleteRecommendation()

  const { data: historyData, isLoading } = CustomHooks.useQuery(
    [
      QUERY_KEYS.RECOMMENDATION_MODULE,
      "history",
      state.page,
      state.pageSize,
      state.filters,
    ],
    () =>
      fetchJobRecommendations({
        page: state.page,
        pageSize: state.pageSize,
        ...state.filters,
      }),
  )

  useEffect(() => {
    if (historyData) {
      updateState({ total: historyData.data.meta.total })
    }
  }, [historyData])

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      render: (id: number) => <Text type="secondary">#{id}</Text>,
    },
    {
      title: "Subscriber",
      dataIndex: "subscriberEmail",
      key: "subscriberEmail",
      render: (email: string) => (
        <Tooltip title={email}>
          <Text style={{ maxWidth: 160 }} ellipsis>
            {email}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      render: (name: string) => name || <Text type="secondary">—</Text>,
    },
    {
      title: "Job",
      dataIndex: "jobTitle",
      key: "jobTitle",
      render: (title: string) => (
        <Tooltip title={title}>
          <Text style={{ maxWidth: 160 }} ellipsis>
            {title}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Match",
      dataIndex: "matchScore",
      key: "matchScore",
      width: 90,
      sorter: (a: IJobRecommendation, b: IJobRecommendation) =>
        (a.matchScore || 0) - (b.matchScore || 0),
      render: (score: number) => {
        if (score == null) return <Text type="secondary">—</Text>
        const color =
          score >= 80 ? "#52c41a" : score >= 60 ? "#fa8c16" : "#f5222d"
        return (
          <Tag color={score >= 80 ? "green" : score >= 60 ? "orange" : "red"}>
            {score.toFixed(1)}%
          </Tag>
        )
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string, record: IJobRecommendation) => (
        <div>
          <Text style={{ fontSize: 12 }} type="secondary">
            {reason || "—"}
          </Text>
          {record.matchedSkills && record.matchedSkills.length > 0 && (
            <div style={{ marginTop: 4 }}>
              {record.matchedSkills.slice(0, 3).map((s) => (
                <Tag key={s} style={{ fontSize: 11 }}>
                  {s}
                </Tag>
              ))}
              {record.matchedSkills.length > 3 && (
                <Tag style={{ fontSize: 11 }}>
                  +{record.matchedSkills.length - 3}
                </Tag>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Email Status",
      dataIndex: "emailStatus",
      key: "emailStatus",
      width: 130,
      render: (status: string, record: IJobRecommendation) => (
        <Select
          value={status}
          style={{ width: 115 }}
          onChange={(value) =>
            updateStatusMutate({ id: record.id, emailStatus: value })
          }
        >
          {Object.values(RECOMMENDATION_STATUS).map((s) => (
            <Select.Option key={s} value={s}>
              <Tag color={STATUS_COLORS[s]}>{STATUS_LABELS[s]}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Sent Time",
      dataIndex: "sentAt",
      key: "sentAt",
      width: 130,
      render: (date: any) =>
        date ? (
          <Text style={{ fontSize: 12 }}>
            {new Date(date).toLocaleString()}
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (date: any) => (
        <Text style={{ fontSize: 12 }}>{new Date(date).toLocaleString()}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      render: (_: any, record: IJobRecommendation) => (
        <Space>
          <Tooltip title="View detail">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() =>
                updateState({ detailDrawerOpen: true, detailId: record.id })
              }
            />
          </Tooltip>
          <Popconfirm
            title="Delete this recommendation?"
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
    <div>
      <FilterPanel
        onSearch={(filters) => updateState({ filters, page: 1 })}
        onReset={() => updateState({ filters: {}, page: 1 })}
      />

      <Table
        columns={columns}
        dataSource={historyData?.data.result || []}
        loading={isLoading}
        rowKey="id"
        size="small"
        scroll={{ x: 1100 }}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: state.total,
          onChange: (page, pageSize) => updateState({ page, pageSize }),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} records`,
        }}
        onRow={(record) => ({
          style: { cursor: "pointer" },
        })}
      />

      <RecommendationDetailDrawer
        id={state.detailId}
        open={state.detailDrawerOpen}
        onClose={() => updateState({ detailDrawerOpen: false, detailId: null })}
      />
    </div>
  )
}

// ============================================================
// Engine Configuration Tab (Phase 1 + Phase 2)
// ============================================================
const ConfigTab: React.FC = () => {
  const [form] = Form.useForm()
  const [totalWeight, setTotalWeight] = useState(100)

  const { data: configData, refetch: refetchConfig } = CustomHooks.useQuery(
    [QUERY_KEYS.RECOMMENDATION_MODULE, "config"],
    fetchRecommendationConfig,
  )

  const { mutate: generateMutate, isPending: isGenerating } =
    useGenerateRecommendations()

  const { mutate: updateConfigMutate, isPending: isUpdatingConfig } =
    CustomHooks.useMutation(updateRecommendationConfig, {
      onSuccess: () => {
        message.success("Configuration updated successfully")
        refetchConfig()
      },
    })

  useEffect(() => {
    if (configData?.data) {
      const { cronExpression, ...rest } = configData.data
      const parts = cronExpression.split(" ")
      const time = dayjs()
        .set("hour", parseInt(parts[2]))
        .set("minute", parseInt(parts[1]))

      form.setFieldsValue({ ...rest, time })
      recalcTotal(rest)
    }
  }, [configData, form])

  const recalcTotal = (values?: any) => {
    const v = values || form.getFieldsValue()
    const total =
      (v.skillMatchWeight || 0) +
      (v.companyFollowWeight || 0) +
      (v.industryWeight || 0) +
      (v.locationWeight || 0) +
      (v.salaryWeight || 0)
    setTotalWeight(total)
  }

  const onFinish = (values: any) => {
    const total =
      values.skillMatchWeight +
      values.companyFollowWeight +
      values.industryWeight +
      values.locationWeight +
      values.salaryWeight

    if (total !== 100) {
      message.error(
        `Strategy weights must total 100%. Current total: ${total}%`,
      )
      return
    }

    const { time, ...rest } = values
    const cronExpression = `0 ${time.minute()} ${time.hour()} * * ?`
    updateConfigMutate({ ...rest, cronExpression })
  }

  const weightFields = [
    { name: "skillMatchWeight", label: "Skill Match", color: "#1677ff" },
    { name: "companyFollowWeight", label: "Company Follow", color: "#722ed1" },
    { name: "industryWeight", label: "Industry Match", color: "#13c2c2" },
    { name: "locationWeight", label: "Location Match", color: "#fa8c16" },
    { name: "salaryWeight", label: "Salary Range", color: "#52c41a" },
  ]

  return (
    <div style={{ maxWidth: 860, marginTop: 20 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={() => recalcTotal()}
        initialValues={{
          isEnabled: true,
          maxJobsPerSubscriber: 10,
          minMatchPercentage: 60,
          onlyLast24h: true,
          skipExpiredJobs: true,
          skipInactiveJobs: true,
          skipAppliedJobs: false,
          skipDuplicates: true,
          skillMatchWeight: 60,
          companyFollowWeight: 15,
          industryWeight: 10,
          locationWeight: 10,
          salaryWeight: 5,
          time: dayjs().set("hour", 20).set("minute", 45),
        }}
      >
        {/* ── Scheduling ── */}
        <Card
          title={
            <Space>
              <ClockCircleOutlined />
              Scheduling Settings
            </Space>
          }
          size="small"
          style={{ marginBottom: 16 }}
        >
          <Row gutter={40}>
            <Col>
              <Form.Item
                label="Execution Time (Daily)"
                name="time"
                rules={[{ required: true, message: "Please select time!" }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="Automatic Scheduler"
                name="isEnabled"
                valuePropName="checked"
              >
                <Switch checkedChildren="ON" unCheckedChildren="OFF" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ── Recommendation Rules ── */}
        <Card
          title={
            <Space>
              <FilterOutlined />
              Recommendation Rules
            </Space>
          }
          size="small"
          style={{ marginBottom: 16 }}
        >
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                label="Minimum Skill Match %"
                name="minMatchPercentage"
                help="Minimum weighted score for a job to be recommended"
              >
                <Slider
                  min={0}
                  max={100}
                  marks={{ 0: "0%", 60: "60%", 100: "100%" }}
                  tooltip={{ formatter: (v) => `${v}%` }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Recommendations per Subscriber"
                name="maxJobsPerSubscriber"
              >
                <InputNumber min={1} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: "8px 0 12px" }} />

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="onlyLast24h"
                valuePropName="checked"
                style={{ marginBottom: 8 }}
              >
                <Checkbox>Only recommend jobs posted in last 24h</Checkbox>
              </Form.Item>
              <Form.Item
                name="skipExpiredJobs"
                valuePropName="checked"
                style={{ marginBottom: 8 }}
              >
                <Checkbox>Skip expired jobs</Checkbox>
              </Form.Item>
              <Form.Item
                name="skipInactiveJobs"
                valuePropName="checked"
                style={{ marginBottom: 8 }}
              >
                <Checkbox>Skip inactive jobs</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="skipAppliedJobs"
                valuePropName="checked"
                style={{ marginBottom: 8 }}
              >
                <Checkbox>Skip jobs already applied to</Checkbox>
              </Form.Item>
              <Form.Item
                name="skipDuplicates"
                valuePropName="checked"
                style={{ marginBottom: 8 }}
              >
                <Checkbox>Skip duplicate recommendations</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ── Strategy Weights ── */}
        <Card
          title={
            <Space>
              <BulbOutlined />
              Recommendation Strategy Weights
            </Space>
          }
          size="small"
          style={{ marginBottom: 16 }}
          extra={
            <Tag
              color={totalWeight === 100 ? "success" : "error"}
              style={{ fontWeight: 600, fontSize: 13 }}
            >
              Total: {totalWeight}% {totalWeight !== 100 && "⚠ Must be 100%"}
            </Tag>
          }
        >
          {totalWeight !== 100 && (
            <Alert
              type="warning"
              message="Weights must total exactly 100% before saving"
              style={{ marginBottom: 12 }}
              showIcon
            />
          )}

          {weightFields.map(({ name, label, color }) => (
            <Row
              key={name}
              gutter={16}
              align="middle"
              style={{ marginBottom: 8 }}
            >
              <Col span={5}>
                <Text strong style={{ color }}>
                  {label}
                </Text>
              </Col>
              <Col span={14}>
                <Form.Item name={name} noStyle>
                  <Slider
                    min={0}
                    max={100}
                    tooltip={{ formatter: (v) => `${v}%` }}
                    trackStyle={{ backgroundColor: color }}
                    handleStyle={{ borderColor: color }}
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name={name} noStyle>
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: "100%" }}
                    addonAfter="%"
                    size="small"
                  />
                </Form.Item>
              </Col>
            </Row>
          ))}

          <Divider style={{ margin: "12px 0 8px" }} />
          <Row>
            <Col span={24}>
              <Progress
                percent={Math.min(totalWeight, 100)}
                strokeColor={
                  totalWeight === 100
                    ? "#52c41a"
                    : totalWeight > 100
                      ? "#f5222d"
                      : "#fa8c16"
                }
                format={() => `${totalWeight}%`}
                size="small"
              />
            </Col>
          </Row>
        </Card>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isUpdatingConfig}
            size="large"
            disabled={totalWeight !== 100}
          >
            Save Configuration
          </Button>
        </Form.Item>
      </Form>

      {/* ── Manual Trigger ── */}
      <Card
        title="Manual Engine Control"
        size="small"
        style={{
          marginTop: 8,
          background: "#f5f5f5",
          border: "1px dashed #d9d9d9",
        }}
      >
        <Text type="secondary">
          Note: Generation is processed in batches of 50 subscribers to optimize
          database performance.
        </Text>
        <div style={{ marginTop: 12 }}>
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
  )
}

// ============================================================
// Main Page
// ============================================================
const RecommendationPage: React.FC = () => {
  const items = [
    {
      key: "config",
      label: (
        <Space>
          <BulbOutlined />
          Engine Configuration
        </Space>
      ),
      children: <ConfigTab />,
    },
    {
      key: "history",
      label: (
        <Space>
          <ClockCircleOutlined />
          Recommendation History
        </Space>
      ),
      children: <HistoryTab />,
    },
  ]

  return (
    <Card bordered={false}>
      <Title level={3} style={{ marginBottom: 0 }}>
        Job Recommendation Engine Manager
      </Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>
        Configure, monitor and manage automated job recommendations for
        subscribers.
      </Text>
      <Tabs defaultActiveKey="config" items={items} />
    </Card>
  )
}

export default RecommendationPage
