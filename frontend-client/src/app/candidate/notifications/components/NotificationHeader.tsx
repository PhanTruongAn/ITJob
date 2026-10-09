"use client"

import DoneAllIcon from "@mui/icons-material/DoneAll"
import { Box, Button, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

interface NotificationHeaderProps {
  hasUnread: boolean
  isMarkingAll: boolean
  onMarkAllAsRead: () => void
}

export default function NotificationHeader({ hasUnread, isMarkingAll, onMarkAllAsRead }: NotificationHeaderProps) {
  const { t } = useTranslation()

  return (
    <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={2} mb={4}>
      <Box>
        <Typography variant="h4" component="h1" fontWeight={900} color="primary.main" gutterBottom>
          {t("notifications.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("notifications.description")}
        </Typography>
      </Box>
      {hasUnread && (
        <Button variant="outlined" onClick={onMarkAllAsRead} disabled={isMarkingAll} startIcon={<DoneAllIcon />} sx={{ fontWeight: "bold", borderRadius: 2.5, borderColor: "divider", color: "primary.main", textTransform: "none", px: 2.5, py: 1 }}>
          {isMarkingAll ? t("notifications.markingAll") : t("notifications.markAllRead")}
        </Button>
      )}
    </Box>
  )
}
