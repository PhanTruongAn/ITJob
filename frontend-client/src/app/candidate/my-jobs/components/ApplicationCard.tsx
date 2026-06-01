"use client"
import { AppStatus, statusConfig } from "@/app/candidate/commons/types"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import EventIcon from "@mui/icons-material/Event"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PaymentsIcon from "@mui/icons-material/Payments"
import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from "@mui/material"

export interface Application {
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

interface ApplicationCardProps {
  app: Application
}

export default function ApplicationCard({ app }: ApplicationCardProps) {
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
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={500}
              sx={{ mb: 1 }}
            >
              {app.company}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <LocationOnIcon
                  sx={{ fontSize: 14, color: "text.secondary" }}
                />
                <Typography variant="caption" color="text.secondary">
                  {app.location}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarTodayIcon
                  sx={{ fontSize: 14, color: "text.secondary" }}
                />
                <Typography variant="caption" color="text.secondary">
                  Applied {app.appliedTime}
                </Typography>
              </Box>
              {app.salary && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <PaymentsIcon sx={{ fontSize: 14, color: "success.main" }} />
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    color="success.main"
                  >
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
                "&:hover": {
                  textDecorationColor: "primary.main",
                  bgcolor: "transparent",
                },
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
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "grey.50",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <EventIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                {app.interviewDate}
              </Typography>
            </Box>
          )}

          {app.status === "reviewing" && app.lastUpdated && (
            <Typography
              variant="caption"
              color="text.secondary"
              fontStyle="italic"
            >
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
