"use client"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import { Box, Button, Typography } from "@mui/material"

interface NotificationHeaderProps {
  hasUnread: boolean
  onMarkAllAsRead: () => void
}

export default function NotificationHeader({
  hasUnread,
  onMarkAllAsRead,
}: NotificationHeaderProps) {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      gap={2}
      mb={4}
    >
      <Box>
        <Typography
          variant="h4"
          fontWeight={900}
          color="primary.main"
          gutterBottom
          sx={{ letterSpacing: "-0.5px" }}
        >
          Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stay updated on your application progress and new opportunities.
        </Typography>
      </Box>
      {hasUnread && (
        <Button
          variant="outlined"
          onClick={onMarkAllAsRead}
          startIcon={<DoneAllIcon />}
          sx={{
            fontWeight: "bold",
            borderRadius: 2.5,
            borderColor: "divider",
            color: "primary.main",
            textTransform: "none",
            px: 2.5,
            py: 1,
          }}
        >
          Mark all as read
        </Button>
      )}
    </Box>
  )
}
