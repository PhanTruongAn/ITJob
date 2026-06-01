"use client"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import PaymentsIcon from "@mui/icons-material/Payments"
import EventIcon from "@mui/icons-material/Event"
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  Button,
  Avatar,
} from "@mui/material"
import { useState } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

type AppStatus = "hired" | "interviewing" | "reviewing" | "not_selected" | "applied"
type FilterTab = "all" | AppStatus

interface Application {
  id: number
  jobTitle: string
  company: string
  logo: string
  location: string
  appliedTime: string
  salary?: string
  status: AppStatus
  interviewDate?: string
  lastUpdated?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const applications: Application[] = [
  {
    id: 1,
    jobTitle: "Senior Full Stack Engineer",
    company: "CloudNexus Solutions",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlS6x1wVLH2f6_ItCgLc_KLQlz-2L7MGzeUk0eLqlVixTsiJRIBTm9RJsTjIIOH6gav2C4evh2ic_HkDQzTQR5bZsUW75ebOTA_zmImggcfX9dF5DlsWNpPEoBVlUfU4471AcFDFY_WNuyM5BEAf5G50NCTzxvQUKhHiWgRBTTE9sW2WIWGqXX_KPcJ1xQJYeK5lSWu-BR0jo1E2r2p3Ygh6GBs8ouFhecXRYUewEyXrNAPgY-6h-p46HDVHGBTEaC2c-IjA02Lkw",
    location: "Ho Chi Minh City",
    appliedTime: "2 days ago",
    salary: "$3,500 - $5,000",
    status: "hired",
  },
  {
    id: 2,
    jobTitle: "Senior React Developer",
    company: "Aura Intelligence",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-10mp5hpBYPYACOv0oAE4NVts1w3iicYo1LHmZ6aOjTwy36kjw_b5hjSHkG5-CcBQdzeJHzHZXJ0cb8wjkUjqf9Clb_2RVdNNjZ9vun7hfG6ga_LAwzfGtOqGGFu2DaxH3RUu5ABmX9AHvuomLFFryhv7dFfuAaufrptCkjOwYmJbBrz-Vn3Iq6cN2-lnVIk8DWt1AzADioUj3vYF9hWPV-urnaUgYC6bhh4f4i7z0VtElPJ_HCz6A99WClLoofKHsdE2-eEJnos",
    location: "Remote",
    appliedTime: "1 week ago",
    salary: "$2,800 - $4,200",
    status: "interviewing",
    interviewDate: "Tue, 14 Nov • 10:00 AM",
  },
  {
    id: 3,
    jobTitle: "DevOps Engineer",
    company: "FinFlow Banking",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ1Os5R9WU9IdNC0aMIK4PuZq_0uyeeL9jsv9YFPSY7aoJIH7JS7RR-vZKEKJo-Cs_MP2N0whkfS8C2ASnCBnRtWjE5nxZ5_y3Ratx7-BF3-t3yQhubbN_zoqT2AHcvT3DrARG9UTDoB2y3yiQ2Zo4GqlLVOjrL6Gd1JBDbW-CDn1T9sdcD7A6Sg2roc1vtqOQIXzJPfN8m63f-O8rJbkJIsEaaHae1ikxZbSbSo2y72Et4kJExNMhST7RiFcZecK9I8-0WJcFKpM",
    location: "Da Nang, Vietnam",
    appliedTime: "5 days ago",
    status: "reviewing",
    lastUpdated: "Last updated yesterday",
  },
  {
    id: 4,
    jobTitle: "UI/UX Designer (Product)",
    company: "StreamLine UX",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_bN3yQEOhN6csAHJBRdNzpTQxEmOsC__9njk-QXBuBxiqj18grh9j_ZkLwESWRMC0KsRkI69m4gN1FCagrqbmHgjmRaYJ3ESo93DLekk5sQB5gWt-gTE8HyCF-6AvH6779Xsnp8wcZJP6Ogu-IjQTfyiGJ0vzxiLtxIclg3U5ofkRlwasqfSARmUv4yUXst2RgNoK1t5EtiUo3KR62f1Ly_JZXiqKYVpwciPpAtGm4CWDYvYNy7yj0v7FQ1oQf7S0NoHSAMv8Iqk",
    location: "Ho Chi Minh City",
    appliedTime: "3 weeks ago",
    status: "not_selected",
  },
]

// ─── Status Badge Config ──────────────────────────────────────────────────────

const statusConfig: Record<AppStatus, { label: string; color: string; bg: string }> = {
  hired: { label: "Hired", color: "#166534", bg: "#dcfce7" },
  interviewing: { label: "Interviewing", color: "#1e3a8a", bg: "#e0e7ff" },
  reviewing: { label: "Reviewing", color: "#334155", bg: "#f1f5f9" },
  not_selected: { label: "Not Selected", color: "#991b1b", bg: "#fee2e2" },
  applied: { label: "Applied", color: "#0369a1", bg: "#e0f2fe" },
}

// ─── Filter Tabs Config ───────────────────────────────────────────────────────

const filterTabs: { label: string; value: FilterTab }[] = [
  { label: "All Jobs", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Interview", value: "interviewing" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Not Selected", value: "not_selected" },
]

// ─── Application Card ─────────────────────────────────────────────────────────

function ApplicationCard({ app }: { app: Application }) {
  const statusCfg = statusConfig[app.status]
  const isNotSelected = app.status === "not_selected"

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "box-shadow 0.2s ease",
        opacity: isNotSelected ? 0.75 : 1,
        filter: isNotSelected ? "grayscale(50%)" : "none",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        {/* Left: Logo + Info */}
        <Box display="flex" alignItems="flex-start" gap={2.5}>
          <Avatar
            src={app.logo}
            variant="rounded"
            sx={{
              width: 56,
              height: 56,
              flexShrink: 0,
              border: "1px solid",
              borderColor: "divider",
              opacity: isNotSelected ? 0.6 : 1,
              bgcolor: "grey.100",
              "& img": { objectFit: "contain" },
            }}
          />
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="primary.main"
              sx={{ mb: 0.3 }}
            >
              {app.jobTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1 }}>
              {app.company}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">{app.location}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">Applied {app.appliedTime}</Typography>
              </Box>
              {app.salary && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <PaymentsIcon sx={{ fontSize: 14, color: "success.main" }} />
                  <Typography variant="caption" fontWeight="bold" color="success.main">
                    {app.salary}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Right: Status + Actions */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "flex-start", md: "flex-end" },
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          <Chip
            label={statusCfg.label.toUpperCase()}
            size="small"
            sx={{
              fontWeight: "bold",
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
              bgcolor: statusCfg.bg,
              color: statusCfg.color,
              borderRadius: 999,
            }}
          />

          {/* Conditional extras */}
          {app.status === "hired" && (
            <Button
              variant="text"
              size="small"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                textDecoration: "underline",
                textDecorationColor: "rgba(0,43,92,0.3)",
                textUnderlineOffset: 3,
                p: 0,
                "&:hover": { textDecorationColor: "primary.main", bgcolor: "transparent" },
              }}
            >
              View Offer Details
            </Button>
          )}

          {app.status === "interviewing" && app.interviewDate && (
            <Box
              display="flex"
              alignItems="center"
              gap={0.8}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "grey.50",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <EventIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {app.interviewDate}
              </Typography>
            </Box>
          )}

          {app.status === "reviewing" && app.lastUpdated && (
            <Typography variant="caption" color="text.secondary" fontStyle="italic">
              {app.lastUpdated}
            </Typography>
          )}

          {app.status === "not_selected" && (
            <Button
              variant="text"
              size="small"
              sx={{
                fontWeight: 500,
                fontSize: "0.75rem",
                color: "text.secondary",
                textDecoration: "underline",
                textUnderlineOffset: 2,
                p: 0,
                "&:hover": { color: "primary.main", bgcolor: "transparent" },
              }}
            >
              Feedback Received
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyJobsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")

  const filteredApps =
    activeFilter === "all"
      ? applications
      : applications.filter((a) => a.status === activeFilter)

  const stats = [
    { label: "Applied", value: 12, sub: "+2 this week", subColor: "success.main" },
    { label: "Interviews", value: 4, sub: "Active", subColor: "success.main" },
    { label: "Reviewing", value: 6, sub: null, subColor: null },
    { label: "Offers", value: 1, sub: "NEW", subColor: "success.main", isOffer: true },
  ]

  return (
    <Box>
      {/* Header */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={900} color="primary.main" gutterBottom>
          My Jobs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your applications and career progress.
        </Typography>
      </Box>

      {/* Stats Bento Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {stat.label}
              </Typography>
              <Box display="flex" alignItems="baseline" gap={1}>
                <Typography
                  variant="h4"
                  fontWeight="900"
                  color={stat.isOffer ? "success.main" : "primary.main"}
                >
                  {stat.value}
                </Typography>
                {stat.sub && (
                  stat.isOffer ? (
                    <Chip
                      label={stat.sub}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.65rem",
                        bgcolor: "success.light",
                        color: "success.dark",
                        borderRadius: 999,
                        height: 20,
                      }}
                    />
                  ) : (
                    <Typography variant="caption" fontWeight="bold" color={stat.subColor || "text.secondary"}>
                      {stat.sub}
                    </Typography>
                  )
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filter Tab Bar */}
      <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 3 }}>
        {filterTabs.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            variant={activeFilter === tab.value ? "contained" : "outlined"}
            size="small"
            sx={{
              borderRadius: 999,
              fontWeight: 500,
              fontSize: "0.8rem",
              px: 2.5,
              py: 0.8,
              textTransform: "none",
              ...(activeFilter === tab.value
                ? {
                    bgcolor: "primary.main",
                    color: "white",
                    borderColor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                  }
                : {
                    bgcolor: "background.paper",
                    color: "text.secondary",
                    borderColor: "divider",
                    "&:hover": { bgcolor: "grey.100", borderColor: "grey.300" },
                  }),
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Stack>

      {/* Application Cards */}
      <Stack spacing={2.5}>
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => <ApplicationCard key={app.id} app={app} />)
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Không có đơn ứng tuyển nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bắt đầu ứng tuyển để theo dõi tiến trình của bạn tại đây.
            </Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  )
}
