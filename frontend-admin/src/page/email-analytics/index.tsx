import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import { useQuery } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import {
  Card,
  Col,
  Row,
  DatePicker,
  Button,
  Space,
  Typography,
  Table,
  Tag,
  Statistic,
  Spin,
  Alert,
  Tooltip as AntTooltip,
} from "antd"
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  DownloadOutlined,
  ReloadOutlined,
  MailOutlined,
} from "@ant-design/icons"
import dayjs, { Dayjs } from "dayjs"
import {
  fetchEmailAnalyticsSummary,
  fetchEmailAnalyticsRecords,
  downloadEmailAnalyticsCsv,
  type EmailAnalyticsRecord,
} from "../../apis/emailAnalyticsModule"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const { Title: AntTitle, Text } = Typography
const { RangePicker } = DatePicker

const STATUS_COLOR: Record<string, string> = {
  SENT: "#52c41a",
  FAILED: "#ff4d4f",
  PENDING: "#faad14",
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  SENT: <CheckCircleOutlined />,
  FAILED: <CloseCircleOutlined />,
  PENDING: <SyncOutlined spin />,
}

export default function EmailAnalyticsPage() {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().subtract(30, "day"),
    dayjs(),
  ])

  const fromStr = dateRange[0]?.format("YYYY-MM-DD")
  const toStr = dateRange[1]?.format("YYYY-MM-DD")

  const {
    data: summary,
    isLoading: summaryLoading,
    refetch: refetchSummary,
    isError: summaryError,
  } = useQuery({
    queryKey: ["emailAnalyticsSummary", fromStr, toStr],
    queryFn: () => fetchEmailAnalyticsSummary(fromStr, toStr),
  })

  const {
    data: records,
    isLoading: recordsLoading,
    refetch: refetchRecords,
    isError: recordsError,
  } = useQuery({
    queryKey: ["emailAnalyticsRecords", fromStr, toStr],
    queryFn: () => fetchEmailAnalyticsRecords(fromStr, toStr),
  })

  // Group records by date for line chart
  const lineChartData = useMemo(() => {
    if (!records) return null
    const byDate: Record<string, { SENT: number; FAILED: number; PENDING: number }> = {}
    records.forEach((r) => {
      const day = dayjs(r.createdAt).format("MM/DD")
      if (!byDate[day]) byDate[day] = { SENT: 0, FAILED: 0, PENDING: 0 }
      byDate[day][r.status] = (byDate[day][r.status] || 0) + 1
    })
    const labels = Object.keys(byDate).sort()
    return {
      labels,
      datasets: [
        {
          label: "Sent",
          data: labels.map((d) => byDate[d].SENT),
          borderColor: "#52c41a",
          backgroundColor: "rgba(82,196,26,0.12)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Failed",
          data: labels.map((d) => byDate[d].FAILED),
          borderColor: "#ff4d4f",
          backgroundColor: "rgba(255,77,79,0.12)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Pending/Retried",
          data: labels.map((d) => byDate[d].PENDING),
          borderColor: "#faad14",
          backgroundColor: "rgba(250,173,20,0.12)",
          tension: 0.4,
          fill: true,
        },
      ],
    }
  }, [records])

  const donutData = summary
    ? {
        labels: ["Sent", "Failed", "Pending"],
        datasets: [
          {
            data: [summary.sent, summary.failed, summary.pending],
            backgroundColor: ["#52c41a", "#ff4d4f", "#faad14"],
            borderWidth: 0,
          },
        ],
      }
    : null

  const barData = summary
    ? {
        labels: ["Sent", "Failed", "Pending"],
        datasets: [
          {
            label: "Count",
            data: [summary.sent, summary.failed, summary.pending],
            backgroundColor: ["#52c41a", "#ff4d4f", "#faad14"],
            borderRadius: 8,
          },
        ],
      }
    : null

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => (
        <Tag icon={STATUS_ICON[status]} color={status === "SENT" ? "success" : status === "FAILED" ? "error" : "warning"}>
          {status}
        </Tag>
      ),
      filters: [
        { text: "SENT", value: "SENT" },
        { text: "FAILED", value: "FAILED" },
        { text: "PENDING", value: "PENDING" },
      ],
      onFilter: (value: any, record: EmailAnalyticsRecord) => record.status === value,
    },
    {
      title: "Attempt",
      dataIndex: "attempt",
      key: "attempt",
      width: 90,
      sorter: (a: EmailAnalyticsRecord, b: EmailAnalyticsRecord) => a.attempt - b.attempt,
    },
    {
      title: "Sent At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (v: string) => dayjs(v).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a: EmailAnalyticsRecord, b: EmailAnalyticsRecord) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Error",
      dataIndex: "errorMessage",
      key: "errorMessage",
      ellipsis: true,
      render: (v: string | null) =>
        v ? (
          <AntTooltip title={v}>
            <Text type="danger" style={{ cursor: "pointer" }}>
              {v.slice(0, 40)}…
            </Text>
          </AntTooltip>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
  ]

  const isLoading = summaryLoading || recordsLoading
  const hasError = summaryError || recordsError
  const successRate =
    summary && summary.total > 0
      ? ((summary.sent / summary.total) * 100).toFixed(1)
      : "0"

  return (
    <div style={{ padding: "0 4px" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          borderRadius: 16,
          padding: "28px 32px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "12px 14px",
              backdropFilter: "blur(8px)",
            }}
          >
            <MailOutlined style={{ fontSize: 28, color: "#fff" }} />
          </div>
          <div>
            <AntTitle level={3} style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
              Email Analytics Dashboard
            </AntTitle>
            <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>
              Monitor email delivery performance
            </Text>
          </div>
        </div>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={(v) => setDateRange(v as [Dayjs | null, Dayjs | null])}
            style={{ borderRadius: 8 }}
            presets={[
              { label: "Last 7 days", value: [dayjs().subtract(7, "day"), dayjs()] },
              { label: "Last 30 days", value: [dayjs().subtract(30, "day"), dayjs()] },
              { label: "Last 90 days", value: [dayjs().subtract(90, "day"), dayjs()] },
            ]}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => { refetchSummary(); refetchRecords() }}
            style={{ borderRadius: 8 }}
          >
            Refresh
          </Button>
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            onClick={() => downloadEmailAnalyticsCsv("records", fromStr, toStr)}
            style={{ borderRadius: 8 }}
          >
            Export CSV
          </Button>
        </Space>
      </div>

      {hasError && (
        <Alert
          type="error"
          message="Failed to load analytics data. Make sure you are logged in as ADMIN."
          showIcon
          style={{ marginBottom: 20, borderRadius: 10 }}
        />
      )}

      <Spin spinning={isLoading}>
        {/* KPI cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {[
            {
              title: "Total Sent",
              value: summary?.sent ?? 0,
              color: "#52c41a",
              bg: "linear-gradient(135deg, #f6ffed, #d9f7be)",
              prefix: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
            },
            {
              title: "Total Failed",
              value: summary?.failed ?? 0,
              color: "#ff4d4f",
              bg: "linear-gradient(135deg, #fff1f0, #ffccc7)",
              prefix: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
            },
            {
              title: "Pending / Retried",
              value: summary?.pending ?? 0,
              color: "#faad14",
              bg: "linear-gradient(135deg, #fffbe6, #fff1b8)",
              prefix: <SyncOutlined style={{ color: "#faad14" }} />,
            },
            {
              title: "Success Rate",
              value: `${successRate}%`,
              color: "#1677ff",
              bg: "linear-gradient(135deg, #e6f4ff, #bae0ff)",
              prefix: <MailOutlined style={{ color: "#1677ff" }} />,
            },
          ].map((item) => (
            <Col xs={24} sm={12} xl={6} key={item.title}>
              <Card
                style={{
                  background: item.bg,
                  borderRadius: 14,
                  border: "none",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}
                bodyStyle={{ padding: "20px 24px" }}
              >
                <Statistic
                  title={
                    <Text style={{ color: "#555", fontWeight: 600, fontSize: 13 }}>
                      {item.title}
                    </Text>
                  }
                  value={item.value}
                  prefix={item.prefix}
                  valueStyle={{ color: item.color, fontWeight: 700, fontSize: 28 }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={16}>
            <Card
              title={<Text strong>Email Delivery Trend</Text>}
              style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
              bodyStyle={{ padding: "16px 24px" }}
            >
              {lineChartData ? (
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    },
                  }}
                  height={100}
                />
              ) : (
                <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Text type="secondary">No data</Text>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Card
                  title={<Text strong>Status Distribution</Text>}
                  style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
                  bodyStyle={{ padding: "12px 24px", display: "flex", justifyContent: "center" }}
                >
                  {donutData ? (
                    <Doughnut
                      data={donutData}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: "bottom" } },
                        cutout: "65%",
                      }}
                      style={{ maxHeight: 180 }}
                    />
                  ) : (
                    <Text type="secondary">No data</Text>
                  )}
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  title={<Text strong>Count by Status</Text>}
                  style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
                  bodyStyle={{ padding: "12px 24px" }}
                >
                  {barData ? (
                    <Bar
                      data={barData}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                      }}
                      height={120}
                    />
                  ) : (
                    <Text type="secondary">No data</Text>
                  )}
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Records table */}
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text strong>Send History Records</Text>
              <Tag color="blue">{records?.length ?? 0} records</Tag>
            </div>
          }
          style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
        >
          <Table
            id="email-analytics-records-table"
            dataSource={records ?? []}
            columns={columns as any}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 15, showSizeChanger: true, showTotal: (t) => `Total ${t} records` }}
            scroll={{ x: 800 }}
            rowClassName={(r: EmailAnalyticsRecord) =>
              r.status === "FAILED" ? "row-failed" : ""
            }
          />
        </Card>
      </Spin>

      <style>{`
        .row-failed td { background: #fff1f0 !important; }
      `}</style>
    </div>
  )
}
