"use client"
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import MailIcon from "@mui/icons-material/Mail"
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff"
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest"
import VerifiedIcon from "@mui/icons-material/Verified"
import WorkOutlineIcon from "@mui/icons-material/WorkOutline"
import {
  Avatar,
  Box,
  Button,
  Card,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Types
type NotificationType = "application" | "alerts" | "system"

interface NotificationItem {
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

// Initial Mock Data from HTML
const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "application",
    title: "Application Status Updated",
    message: "Your application for ",
    boldText: "Senior Frontend Architect",
    boldSubject: ' at TechFlow Systems has been moved to "Under Review".',
    time: "2 hours ago",
    unread: true,
    iconType: "assignment",
    detailsLink: "#",
    secondaryAction: {
      label: "Mark as read",
      actionType: "read",
    },
  },
  {
    id: 2,
    type: "alerts",
    title: "New Job Match: Senior React Developer",
    message: "A new position at ",
    boldText: "CloudScale AI",
    boldSubject:
      " matches your preferred tech stack and salary range ($160k - $200k).",
    time: "5 hours ago",
    unread: false,
    iconType: "work",
    primaryAction: {
      label: "Apply Now",
      href: "/jobs/102",
    },
    secondaryAction: {
      label: "See Similar Jobs",
      href: "/jobs",
    },
  },
  {
    id: 3,
    type: "application",
    title: "Interview Invitation",
    message: "Sarah Jenkins from ",
    boldText: "Innovate Labs",
    boldSubject:
      " invited you for a technical screening for the Principal Engineer role.",
    time: "Yesterday",
    unread: true,
    iconType: "mail",
    primaryAction: {
      label: "Schedule Interview",
      href: "/candidate/job-invitations",
    },
    secondaryAction: {
      label: "Decline",
      actionType: "decline",
    },
  },
  {
    id: 4,
    type: "system",
    title: "System Maintenance Scheduled",
    message:
      "The Terminal Slate platform will be undergoing scheduled maintenance this Sunday from 2:00 AM to 4:00 AM UTC. Plan your applications accordingly.",
    time: "2 days ago",
    unread: false,
    iconType: "settings",
    detailsLink: "#",
  },
  {
    id: 5,
    type: "system",
    title: "Profile Verification Complete",
    message:
      'Great news! Your professional profile has been verified. You now have a "Verified Pro" badge on your public CV.',
    time: "3 days ago",
    unread: false,
    iconType: "verified",
    detailsLink: "/candidate/itviec-profile",
  },
]

export default function NotificationsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("all")
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <Box p={4}>Loading...</Box>
  }

  if (status === "unauthenticated") {
    return null
  }

  // Filter logic
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "application") return item.type === "application"
    if (activeTab === "alerts") return item.type === "alerts"
    if (activeTab === "system") return item.type === "system"
    return true
  })

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })))
  }

  // Mark single item as read
  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    )
  }

  // Decline invitation
  const handleDecline = (id: number) => {
    // Just mock action to remove or change status
    setNotifications((prev) => prev.filter((item) => item.id !== id))
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

  return (
    <Box sx={{ maxWidth: 850, mx: "auto" }}>
      {/* Header & Actions */}
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
        {notifications.some((n) => n.unread) && (
          <Button
            variant="outlined"
            onClick={handleMarkAllAsRead}
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

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            minHeight: 0,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              minWidth: 0,
              px: 3,
              py: 1.5,
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
            "& .MuiTabs-indicator": {
              bgcolor: "primary.main",
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab value="all" label="All" />
          <Tab value="application" label="Application Updates" />
          <Tab value="alerts" label="Job Alerts" />
          <Tab value="system" label="System" />
        </Tabs>
      </Box>

      {/* Notification List */}
      {filteredNotifications.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {filteredNotifications.map((item) => (
            <Card
              key={item.id}
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
                    bgcolor: item.unread
                      ? getIconBg(item.type)
                      : "action.hover",
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
                      <Box
                        component="span"
                        fontWeight={700}
                        color="text.primary"
                      >
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
                            onClick={() => handleMarkAsRead(item.id)}
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
                            onClick={() => handleDecline(item.id)}
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
          ))}

          {/* Load More Button */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="outlined"
              sx={{
                fontWeight: "bold",
                borderRadius: 5,
                borderColor: "divider",
                color: "text.secondary",
                px: 4,
                py: 1,
                textTransform: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  bgcolor: "action.hover",
                  borderColor: "divider",
                  color: "primary.main",
                },
              }}
            >
              Load older notifications
            </Button>
          </Box>
        </Box>
      ) : (
        /* Empty State */
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 12,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 140,
              height: 140,
              mb: 3,
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "grey.800" : "grey.100",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <NotificationsOffIcon
              sx={{ fontSize: 60, color: "text.secondary", opacity: 0.6 }}
            />
          </Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            You&apos;re all caught up!
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 300, mb: 3 }}
          >
            No new notifications at the moment. We&apos;ll let you know when
            something important happens.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setNotifications(initialNotifications)}
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
              py: 1,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Check for updates
          </Button>
        </Box>
      )}
    </Box>
  )
}
