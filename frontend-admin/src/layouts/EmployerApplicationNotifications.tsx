import { BellOutlined, ReloadOutlined } from "@ant-design/icons"
import { useQueryClient } from "@tanstack/react-query"
import {
  Alert,
  Badge,
  Button,
  Empty,
  List,
  Popover,
  Space,
  Spin,
  Typography,
} from "antd"
import dayjs from "dayjs"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  fetchEmployerApplicationNotifications,
  fetchEmployerUnreadNotificationCount,
  markAllEmployerNotificationsRead,
  markEmployerNotificationRead,
} from "../apis/employerNotificationModule"
import CustomHooks from "../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../common/queryKeys"
import { PATH_DASHBOARD } from "../routes/paths"
import { IEmployerApplicationNotification } from "../types/backend"

const PAGE_SIZE = 6
const notificationQueryKey = [QUERY_KEYS.EMPLOYER_NOTIFICATION_MODULE] as const

const EmployerApplicationNotifications = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const notificationsQuery = CustomHooks.useQuery(
    [...notificationQueryKey, "list", 0, PAGE_SIZE],
    () => fetchEmployerApplicationNotifications({ page: 0, size: PAGE_SIZE }),
  )
  const unreadQuery = CustomHooks.useQuery(
    [...notificationQueryKey, "unread-count"],
    fetchEmployerUnreadNotificationCount,
  )

  const invalidateNotifications = () =>
    queryClient.invalidateQueries({ queryKey: notificationQueryKey })

  const markReadMutation = CustomHooks.useMutation(markEmployerNotificationRead, {
    onSuccess: invalidateNotifications,
  })
  const markAllReadMutation = CustomHooks.useMutation(markAllEmployerNotificationsRead, {
    onSuccess: invalidateNotifications,
  })

  const openApplication = (notification: IEmployerApplicationNotification) => {
    setOpen(false)
    if (!notification.read) markReadMutation.mutate(notification.id)
    navigate(PATH_DASHBOARD.resumeManage.list)
  }

  const unreadCount = unreadQuery.data?.data?.count
  const listContent = notificationsQuery.isLoading ? (
    <div style={{ padding: 24, textAlign: "center" }}>
      <Spin />
    </div>
  ) : notificationsQuery.isError ? (
    <Alert
      type="error"
      showIcon
      message={t("notifications.loadError")}
      action={
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => void notificationsQuery.refetch()}
        >
          {t("notifications.retry")}
        </Button>
      }
    />
  ) : notificationsQuery.data?.data?.result?.length ? (
    <List
      dataSource={notificationsQuery.data.data.result}
      renderItem={(notification) => (
        <List.Item style={{ paddingInline: 0 }}>
          <Button
            type="text"
            block
            style={{ height: "auto", textAlign: "left", whiteSpace: "normal", padding: 8 }}
            onClick={() => openApplication(notification)}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Typography.Text strong={!notification.read}>
                {t("notifications.applicationReceived", {
                  candidate: notification.candidateName || t("notifications.candidate"),
                  job: notification.jobTitle || t("notifications.job"),
                })}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(notification.createdAt).format("MMM D, YYYY h:mm A")}
              </Typography.Text>
            </Space>
          </Button>
        </List.Item>
      )}
    />
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("notifications.empty")} />
  )

  const content = (
    <div style={{ width: 360, maxWidth: "calc(100vw - 48px)" }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {unreadQuery.isError && (
          <Alert
            type="warning"
            showIcon
            message={t("notifications.countError")}
            action={
              <Button size="small" onClick={() => void unreadQuery.refetch()}>
                {t("notifications.retry")}
              </Button>
            }
          />
        )}
        {listContent}
      </Space>
    </div>
  )

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
      title={
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <span>{t("notifications.title")}</span>
          {typeof unreadCount === "number" && unreadCount > 0 && (
            <Button
              type="link"
              size="small"
              loading={markAllReadMutation.isPending}
              onClick={() => markAllReadMutation.mutate()}
            >
              {t("notifications.markAllRead")}
            </Button>
          )}
        </Space>
      }
      content={content}
    >
      <Button type="text" aria-label={t("notifications.title")}>
        <Badge count={unreadCount} overflowCount={99}>
          <BellOutlined style={{ fontSize: 20 }} />
        </Badge>
      </Button>
    </Popover>
  )
}

export default EmployerApplicationNotifications
