import { BellOutlined, ReloadOutlined } from "@ant-design/icons"
import { Alert, Badge, Button, Empty, List, Popover, Space, Spin, Tag, Typography } from "antd"
import dayjs from "dayjs"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  fetchManagementPendingReviewCount,
  fetchManagementReviewNotifications,
} from "../apis/managementReviewNotificationModule"
import CustomHooks from "../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../common/queryKeys"
import { PATH_DASHBOARD } from "../routes/paths"
import { IManagementReviewNotification } from "../types/backend"

const PAGE_SIZE = 10
const reviewQueryKey = [QUERY_KEYS.MANAGEMENT_REVIEW_NOTIFICATION_MODULE] as const

const ManagementReviewNotifications = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const listQuery = CustomHooks.useQuery(
    [...reviewQueryKey, "list", 0, PAGE_SIZE],
    () => fetchManagementReviewNotifications({ page: 0, size: PAGE_SIZE }),
    { enabled: open },
  )
  const countQuery = CustomHooks.useQuery(
    [...reviewQueryKey, "pending-count"],
    fetchManagementPendingReviewCount,
  )

  const refresh = () => {
    void listQuery.refetch()
    void countQuery.refetch()
  }
  const openReview = (item: IManagementReviewNotification) => {
    setOpen(false)
    if (item.type === "COMPANY_REVIEW_REQUIRED") {
      navigate(PATH_DASHBOARD.companyManage.edit.replace(":id", String(item.companyId)))
    }
    else navigate(PATH_DASHBOARD.jobManage.list)
  }

  const list = listQuery.isLoading ? (
    <div style={{ padding: 24, textAlign: "center" }}><Spin /></div>
  ) : listQuery.isError ? (
    <Alert type="error" showIcon message={t("notifications.loadReviewError")} action={
      <Button size="small" icon={<ReloadOutlined />} onClick={refresh}>{t("notifications.retry")}</Button>
    } />
  ) : listQuery.data?.data?.result?.length ? (
    <List
      dataSource={listQuery.data.data.result}
      renderItem={(item) => {
        const isCompany = item.type === "COMPANY_REVIEW_REQUIRED"
        return (
          <List.Item style={{ paddingInline: 0 }}>
            <Button type="text" block style={{ height: "auto", textAlign: "left", whiteSpace: "normal", padding: 8 }}
              onClick={() => openReview(item)}>
              <Space direction="vertical" size={3} style={{ width: "100%" }}>
                <Space wrap>
                  <Tag color={isCompany ? "blue" : "purple"}>
                    {t(isCompany ? "notifications.companyReviewType" : "notifications.jobReviewType")}
                  </Tag>
                  {item.reviewStatus && <Tag>{t(`notifications.reviewStatus.${item.reviewStatus}`, item.reviewStatus)}</Tag>}
                </Space>
                <Typography.Text strong>
                  {isCompany
                    ? t("notifications.companyReview", { name: item.companyName || t("notifications.company") })
                    : t("notifications.jobReview", { name: item.jobTitle || t("notifications.job") })}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(item.createdAt).format("MMM D, YYYY h:mm A")}
                </Typography.Text>
              </Space>
            </Button>
          </List.Item>
        )
      }}
    />
  ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("notifications.noPendingReviews")} />

  const content = (
    <div style={{ width: 390, maxWidth: "calc(100vw - 48px)" }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {countQuery.isError && <Alert type="warning" showIcon message={t("notifications.reviewCountError")}
          action={<Button size="small" onClick={() => void countQuery.refetch()}>{t("notifications.retry")}</Button>} />}
        {list}
      </Space>
    </div>
  )

  return (
    <Popover trigger="click" placement="bottomRight" open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        // The badge is loaded on mount; refresh it when returning from a review action.
        if (nextOpen && countQuery.data) void countQuery.refetch()
      }}
      title={<span>{t("notifications.reviewTitle")}</span>}
      content={content}>
      <Button type="text" aria-label={t("notifications.reviewTitle")}>
        <Badge count={countQuery.data?.data?.count} overflowCount={99}>
          <BellOutlined style={{ fontSize: 20 }} />
        </Badge>
      </Button>
    </Popover>
  )
}

export default ManagementReviewNotifications
