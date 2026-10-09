"use client"

import {
  useCandidateNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useUnreadNotificationCount,
} from "@/apis/notification/notification.hooks"
import { Alert, Box, Button, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import NotificationCard from "./components/NotificationCard"
import NotificationHeader from "./components/NotificationHeader"

const PAGE_SIZE = 10

export default function NotificationsPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState(1)
  const notificationsQuery = useCandidateNotifications(page, PAGE_SIZE)
  const unreadCountQuery = useUnreadNotificationCount()
  const markOneMutation = useMarkNotificationRead()
  const markAllMutation = useMarkAllNotificationsRead()
  const notifications = notificationsQuery.data?.data?.result ?? []
  const pagination = notificationsQuery.data?.data?.meta
  const unreadCount = unreadCountQuery.data?.data?.count ?? 0

  useEffect(() => {
    if (notificationsQuery.sessionStatus === "unauthenticated") {
      router.replace("/signin")
    } else if (
      notificationsQuery.sessionStatus === "authenticated" &&
      !notificationsQuery.hasCandidateAccess
    ) {
      router.replace("/")
    }
  }, [notificationsQuery.sessionStatus, notificationsQuery.hasCandidateAccess, router])

  useEffect(() => {
    if (pagination && (pagination.pages === 0 ? page !== 1 : page > pagination.pages)) {
      setPage(pagination.pages || 1)
    }
  }, [page, pagination])

  const openNotification = (item: (typeof notifications)[number]) => {
    if (!item.read) markOneMutation.mutate(item.id)
  }

  if (notificationsQuery.sessionStatus === "loading") {
    return (
      <Box role="status" p={4} display="flex" alignItems="center" gap={2}>
        <CircularProgress size={20} />
        <Typography>{t("notifications.loading")}</Typography>
      </Box>
    )
  }

  if (!notificationsQuery.hasCandidateAccess) return null

  return (
    <Box sx={{ maxWidth: 850, mx: "auto" }}>
      <NotificationHeader
        hasUnread={unreadCount > 0 || notifications.some((notification) => !notification.read)}
        isMarkingAll={markAllMutation.isPending}
        onMarkAllAsRead={() => markAllMutation.mutate()}
      />

      {(markOneMutation.isError || markAllMutation.isError) && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                if (markAllMutation.isError) markAllMutation.mutate()
                else if (markOneMutation.variables !== undefined) markOneMutation.mutate(markOneMutation.variables)
              }}
            >
              {t("notifications.retry")}
            </Button>
          }
        >
          {t("notifications.updateError")}
        </Alert>
      )}

      {notificationsQuery.isLoading ? (
        <Box role="status" display="flex" justifyContent="center" alignItems="center" gap={2} py={8}>
          <CircularProgress />
          <Typography>{t("notifications.loading")}</Typography>
        </Box>
      ) : notificationsQuery.isError ? (
        <Alert
          severity="error"
          action={<Button color="inherit" size="small" onClick={() => void notificationsQuery.refetch()}>{t("notifications.retry")}</Button>}
        >
          {t("notifications.loadError")}
        </Alert>
      ) : notifications.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10} textAlign="center">
          <NotificationsOffIcon sx={{ fontSize: 56, color: "text.secondary", opacity: 0.6, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {t("notifications.emptyTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: 3 }}>
            {t("notifications.emptyDescription")}
          </Typography>
          <Button component={Link} href="/jobs" variant="contained">
            {t("notifications.browseJobs")}
          </Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              item={notification}
              locale={i18n.language}
              onMarkAsRead={(id) => markOneMutation.mutate(id)}
              onOpen={openNotification}
            />
          ))}
          {pagination && pagination.pages > 1 && (
            <Box display="flex" justifyContent="center" pt={2}>
              <Pagination
                count={pagination.pages}
                page={page}
                onChange={(_, nextPage) => setPage(nextPage)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Stack>
      )}

      {unreadCountQuery.isError && !notificationsQuery.isError && (
        <Alert severity="warning" sx={{ mt: 2 }} action={<Button color="inherit" size="small" onClick={() => void unreadCountQuery.refetch()}>{t("notifications.retry")}</Button>}>
          {t("notifications.unreadCountError")}
        </Alert>
      )}
    </Box>
  )
}
