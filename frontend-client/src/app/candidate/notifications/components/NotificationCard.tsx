"use client"

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"
import { Avatar, Box, Button, Card, Chip, Stack, Typography } from "@mui/material"
import { INotification } from "@/apis/notification/notification.types"
import Link from "next/link"
import { useTranslation } from "react-i18next"

interface NotificationCardProps {
  item: INotification
  locale: string
  onMarkAsRead: (id: number) => void
  onOpen: (item: INotification) => void
}

export default function NotificationCard({ item, locale, onMarkAsRead, onOpen }: NotificationCardProps) {
  const { t } = useTranslation()
  const formattedDate = item.createdAt && !Number.isNaN(Date.parse(item.createdAt))
    ? new Intl.DateTimeFormat(locale.startsWith("vi") ? "vi-VN" : "en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))
    : t("notifications.dateUnavailable")
  const status = item.applicationStatus
  const jobTitle = item.jobTitle || t("notifications.jobFallback", { id: item.jobId ?? item.relatedResumeId })
  const jobHref = item.jobId ? `/jobs/${item.jobId}` : "/candidate/my-jobs"

  return (
    <Card
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        borderColor: item.read ? "divider" : "primary.light",
        boxShadow: "none",
        position: "relative",
        overflow: "hidden",
        opacity: item.read ? 0.82 : 1,
        bgcolor: item.read ? "background.paper" : "action.hover",
      }}
    >
      <Box display="flex" gap={2} alignItems="flex-start">
        <Avatar sx={{ bgcolor: item.read ? "action.selected" : "primary.light", width: 48, height: 48, borderRadius: 2, flexShrink: 0 }}>
          <AssignmentTurnedInIcon color="primary" />
        </Avatar>
        <Box flexGrow={1} minWidth={0}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={1} mb={0.5}>
            <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
              {t(`notifications.status.${status}.title`)}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {formattedDate}
              </Typography>
              <Chip size="small" label={item.read ? t("notifications.read") : t("notifications.unread")} color={item.read ? "default" : "primary"} variant={item.read ? "outlined" : "filled"} />
            </Stack>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
            {t(`notifications.status.${status}.message`, { jobTitle })}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Button component={Link} href={jobHref} variant="contained" size="small" onClick={() => onOpen(item)}>
              {t("notifications.viewApplication")}
            </Button>
            {!item.read && (
              <Button size="small" onClick={() => onMarkAsRead(item.id)}>
                {t("notifications.markRead")}
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Card>
  )
}
