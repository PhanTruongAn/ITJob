"use client"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import DashboardIcon from "@mui/icons-material/Dashboard"
import DescriptionIcon from "@mui/icons-material/Description"
import MailIcon from "@mui/icons-material/Mail"
import NotificationsIcon from "@mui/icons-material/Notifications"
import SettingsIcon from "@mui/icons-material/Settings"
import SubscriptionsIcon from "@mui/icons-material/Subscriptions"
import WorkIcon from "@mui/icons-material/Work"
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"

export default function SideNavBar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { t } = useTranslation()

  const navItems = [
    {
      label: t("nav.dashboard", "Dashboard"),
      href: "/candidate/dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      label: t("nav.cvAttachment", "CV Management"),
      href: "/candidate/cv-attachment",
      icon: <DescriptionIcon fontSize="small" />,
    },
    {
      label: t("nav.profile", "Profile"),
      href: "/candidate/profile",
      icon: <AccountCircleIcon fontSize="small" />,
    },
    {
      label: t("nav.myJobs", "My Jobs"),
      href: "/candidate/my-jobs",
      icon: <WorkIcon fontSize="small" />,
    },
    {
      label: t("nav.jobInvitations", "Job Invitations"),
      href: "/candidate/job-invitations",
      icon: <MailIcon fontSize="small" />,
      badge: 0,
    },
    {
      label: t("nav.emailSubscriptions", "Email Subscriptions"),
      href: "/candidate/email-subscriptions",
      icon: <SubscriptionsIcon fontSize="small" />,
    },
    {
      label: t("nav.notifications", "Notifications"),
      href: "/candidate/notifications",
      icon: <NotificationsIcon fontSize="small" />,
    },
    {
      label: t("nav.settings", "Settings"),
      href: "/candidate/settings",
      icon: <SettingsIcon fontSize="small" />,
    },
  ]

  return (
    <Box
      component="aside"
      sx={{
        display: { xs: "none", lg: "flex" },
        flexDirection: "column",
        width: 300,
        height: "fit-content",
        position: "sticky",
        top: "calc(var(--template-frame-height, 0px) + 80px)", // Added top margin so it floats
        ml: 4, // Left margin to float inside the layout
        mt: 4,
        mb: 4,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        p: 2,
        zIndex: 10,
      }}
    >
      {/* Greeting Section */}
      <Box sx={{ mb: 3, px: 2, pt: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <span
            role="img"
            aria-label="wave"
            style={{ color: "#e53935", fontSize: "1.1rem" }}
          >
            👋🏻
          </span>{" "}
          {t("nav.welcome", "Welcome")}
        </Typography>
        <Typography
          variant="h6"
          fontWeight={800}
          mt={0.5}
          sx={{ color: "text.primary", fontSize: "1.25rem" }}
        >
          {session?.user?.name || "Phan Trường An"}
        </Typography>
      </Box>

      {/* Navigation List */}
      <Box sx={{ flexGrow: 1 }}>
        <List disablePadding>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/candidate/dashboard" && pathname === "/candidate") // fallback

            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 2,
                    "&.Mui-selected": {
                      bgcolor: "#fff0f0", // Very light red
                      color: "#e53935", // Red text/icon
                      "& .MuiListItemIcon-root": {
                        color: "#e53935",
                      },
                      "&:hover": {
                        bgcolor: "#ffebee",
                      },
                    },
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? "#e53935" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#e53935" : "text.primary",
                    }}
                  />

                  {/* Badge for Job Invitation */}
                  {item.badge !== undefined && (
                    <Box
                      sx={{
                        bgcolor: "#1976d2", // Blue badge
                        color: "white",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        ml: 1,
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>
    </Box>
  )
}
