"use client"
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"
import MailIcon from "@mui/icons-material/Mail"
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest"
import VerifiedIcon from "@mui/icons-material/Verified"
import WorkOutlineIcon from "@mui/icons-material/WorkOutline"
import { Avatar, Box, Button, Card, Stack, Typography } from "@mui/material"
import Link from "next/link"

export type NotificationType = "application" | "alerts" | "system"

export interface NotificationItem {
  id: number
  type: NotificationType
  title: string
  message: string
  boldText?: string
  boldSubject?: string
  time: string
  unread: boolean
  iconType: "assignment" | "work" | "mail" | "settings" | "verified"
  detailsLink?: string
  primaryAction?: {
    label: string
    href: string
  }
  secondaryAction?: {
    label: string
    href?: string
    actionType?: "decline" | "read"
  }
}

interface NotificationCardProps {
  item: NotificationItem
  onMarkAsRead: (id: number) => void
  onDecline: (id: number) => void
}

// Icon mapping helper
const renderIcon = (iconType: string) => {
  switch (iconType) {
    case "assignment":
      return <AssignmentTurnedInIcon color="primary" />
    case "work":
      return <WorkOutlineIcon sx={{ color: "tertiary.main" }} />
    case "mail":
      return <MailIcon color="primary" />
    case "settings":
      return <SettingsSuggestIcon color="secondary" />
    case "verified":
      return <VerifiedIcon sx={{ color: "tertiary.main" }} />
    default:
      return <AssignmentTurnedInIcon color="primary" />
  }
}

// Icon bg helper
const getIconBg = (type: NotificationType) => {
  switch (type) {
    case "application":
      return "primary.light" // Soft blue
    case "alerts":
      return "#dcfce7" // Soft green
    case "system":
      return "grey.100" // Soft grey
    default:
      return "grey.50"
  }
}

export default function NotificationCard({
  item,
  onMarkAsRead,
  onDecline,
}: NotificationCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        borderColor: "divider",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.01)",
        position: "relative",
        overflow: "hidden",
        opacity: item.unread ? 1 : 0.8,
        bgcolor: (t) =>
          item.unread
            ? t.palette.mode === "dark"
              ? "rgba(25, 118, 210, 0.05)"
              : "#f8fafc"
            : "background.paper",
        "&:hover": {
          boxShadow: "0px 4px 16px rgba(0,0,0,0.03)",
          borderColor: "divider",
          bgcolor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(255,255,255,0.02)"
              : "#f1f5f9",
        },
        transition: "all 0.2s ease",
      }}
    >
      {/* Left blue accent line for unread notifications */}
      {item.unread && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: "primary.main",
          }}
        />
      )}

      <Box display="flex" gap={2} alignItems="flex-start">
        {/* Icon Avatar */}
        <Avatar
          sx={{
            bgcolor: item.unread ? getIconBg(item.type) : "action.hover",
            width: 48,
            height: 48,
            borderRadius: 2,
            flexShrink: 0,
          }}
        >
          {renderIcon(item.iconType)}
        </Avatar>

        {/* Content */}
        <Box flexGrow={1} minWidth={0}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={0.5}
            gap={1.5}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="text.primary"
              noWrap
            >
              {item.title}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ whiteSpace: "nowrap", fontWeight: 500 }}
              >
                {item.time}
              </Typography>
              {item.unread && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                  }}
                />
              )}
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, leading: "1.6" }}
          >
            {item.message}
            {item.boldText && (
              <Box component="span" fontWeight={700} color="text.primary">
                {item.boldText}
              </Box>
            )}
            {item.boldSubject && (
              <Box component="span" fontWeight={500}>
                {item.boldSubject}
              </Box>
            )}
          </Typography>

          {/* Actions Row */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Primary Button */}
            {item.primaryAction && (
              <Button
                component={Link}
                href={item.primaryAction.href}
                variant="contained"
                size="small"
                sx={{
                  fontWeight: "bold",
                  borderRadius: 2,
                  px: 2.5,
                  py: 0.75,
                  fontSize: "0.75rem",
                }}
              >
                {item.primaryAction.label}
              </Button>
            )}

            {/* Details Link */}
            {item.detailsLink && (
              <Typography
                variant="body2"
                fontWeight="bold"
                color="primary.main"
                component={Link}
                href={item.detailsLink}
                sx={{
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {item.boldText === "Senior Frontend Architect"
                  ? "View Details"
                  : item.boldText === "Profile Verification Complete"
                    ? "View My Public CV"
                    : "Learn More"}
              </Typography>
            )}

            {/* Secondary Action */}
            {item.secondaryAction && (
              <Box>
                {item.secondaryAction.actionType === "read" ? (
                  <Button
                    size="small"
                    onClick={() => onMarkAsRead(item.id)}
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                      textTransform: "none",
                      p: 0,
                    }}
                  >
                    {item.secondaryAction.label}
                  </Button>
                ) : item.secondaryAction.actionType === "decline" ? (
                  <Button
                    size="small"
                    onClick={() => onDecline(item.id)}
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "text.secondary",
                      "&:hover": { color: "error.main" },
                      textTransform: "none",
                      p: 0,
                    }}
                  >
                    {item.secondaryAction.label}
                  </Button>
                ) : (
                  <Button
                    component={Link}
                    href={item.secondaryAction.href || "#"}
                    size="small"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                      textTransform: "none",
                      p: 0,
                    }}
                  >
                    {item.secondaryAction.label}
                  </Button>
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </Card>
  )
}
