"use client"
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff"
import { Box, Button, Typography } from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import NotificationCard, {
  NotificationItem,
} from "./components/NotificationCard"
import NotificationHeader from "./components/NotificationHeader"
import NotificationTabs from "./components/NotificationTabs"

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
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }

  const hasUnread = notifications.some((n) => n.unread)

  return (
    <Box sx={{ maxWidth: 850, mx: "auto" }}>
      {/* Header & Actions */}
      <NotificationHeader
        hasUnread={hasUnread}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Tabs */}
      <NotificationTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Notification List */}
      {filteredNotifications.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {filteredNotifications.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              onMarkAsRead={handleMarkAsRead}
              onDecline={handleDecline}
            />
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
