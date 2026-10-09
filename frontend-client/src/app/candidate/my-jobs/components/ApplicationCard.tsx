"use client"

import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from "@mui/material"
import { IResume } from "@/types/backend"
import Link from "next/link"
import { useTranslation } from "react-i18next"

interface ApplicationCardProps {
  app: IResume
  locale: string
}

const statusColors: Record<IResume["status"], { color: string; background: string }> = {
  PENDING: { color: "#0369a1", background: "#e0f2fe" },
  REVIEWING: { color: "#334155", background: "#f1f5f9" },
  APPROVED: { color: "#166534", background: "#dcfce7" },
  REJECTED: { color: "#991b1b", background: "#fee2e2" },
}

export default function ApplicationCard({ app, locale }: ApplicationCardProps) {
  const { t } = useTranslation()
  const createdAt = app.createdAt ? new Date(app.createdAt) : undefined
  const submittedDate = createdAt && !Number.isNaN(createdAt.getTime())
    ? new Intl.DateTimeFormat(locale.startsWith("vi") ? "vi-VN" : "en-US", { dateStyle: "medium" }).format(createdAt)
    : t("myApplications.dateUnavailable")
  const color = statusColors[app.status]

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", transition: "box-shadow 0.2s ease", "&:hover": { boxShadow: 3 } }}
    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { md: "center" }, justifyContent: "space-between", gap: 3 }}>
        <Box display="flex" alignItems="flex-start" gap={2.5}>
          <Avatar
            src={app.companyLogo || undefined}
            alt={app.companyName || t("myApplications.companyFallback")}
            variant="rounded"
            sx={{ width: 56, height: 56, flexShrink: 0, border: "1px solid", borderColor: "divider", bgcolor: "grey.100", "& img": { objectFit: "contain" } }}
          >
            {(app.companyName || "?").slice(0, 1).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ mb: 0.3 }}>
              <Link href={`/jobs/${app.jobId}`} style={{ color: "inherit", textDecoration: "none" }}>
                {app.jobName || t("myApplications.jobFallback", { id: app.jobId })}
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1 }}>
              {app.companyName || t("myApplications.companyFallback")}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {t("myApplications.appliedOn", { date: submittedDate })}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", md: "flex-end" }, gap: 1.5, flexShrink: 0 }}>
          <Chip
            label={t(`myApplications.status.${app.status}`)}
            size="small"
            sx={{ fontWeight: "bold", fontSize: "0.7rem", letterSpacing: "0.05em", bgcolor: color.background, color: color.color, borderRadius: 999 }}
          />
          <Button component={Link} href={`/jobs/${app.jobId}`} variant="text" size="small">
            {t("myApplications.viewJob")}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
