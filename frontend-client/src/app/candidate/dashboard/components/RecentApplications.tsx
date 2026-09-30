"use client"

import { IResume } from "@/types/backend"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useTranslation } from "react-i18next"

interface RecentApplicationsProps {
  applications: IResume[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

const statusColors: Record<IResume["status"], { color: string; bg: string }> = {
  PENDING: { color: "#0369a1", bg: "#e0f2fe" },
  REVIEWING: { color: "#334155", bg: "#f1f5f9" },
  APPROVED: { color: "#166534", bg: "#dcfce7" },
  REJECTED: { color: "#991b1b", bg: "#fee2e2" },
}

export default function RecentApplications({
  applications,
  isLoading,
  isError,
  onRetry,
}: RecentApplicationsProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage?.startsWith("en") ? "en-US" : "vi-VN"

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          {t("dashboard.recentApplications")}
        </Typography>
        <Button
          component={Link}
          href="/candidate/my-jobs"
          size="small"
          endIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{ fontWeight: "bold" }}
        >
          {t("dashboard.viewAll")}
        </Button>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={28} />
        </Box>
      ) : isError ? (
        <Box textAlign="center" py={2}>
          <Typography color="error.main" mb={1}>
            {t("dashboard.applicationsLoadError")}
          </Typography>
          <Button onClick={onRetry}>{t("dashboard.retry")}</Button>
        </Box>
      ) : applications.length === 0 ? (
        <Box textAlign="center" py={3}>
          <Typography color="text.secondary">
            {t("dashboard.noApplications")}
          </Typography>
          <Button component={Link} href="/jobs" sx={{ mt: 1 }}>
            {t("dashboard.findJobs")}
          </Button>
        </Box>
      ) : (
        <List disablePadding>
          {applications.map((application, index) => {
            const status = statusColors[application.status]
            const appliedDate = application.createdAt
              ? new Date(application.createdAt)
              : undefined
            const formattedDate =
              appliedDate && !Number.isNaN(appliedDate.getTime())
                ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                    appliedDate,
                  )
                : t("dashboard.dateUnavailable")

            return (
              <Box key={application.id}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <ListItem
                  disableGutters
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                    p: 1,
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.03)"
                          : "grey.50",
                    },
                    transition: "bgcolor 0.2s ease",
                  }}
                >
                  <Avatar
                    src={application.companyLogo || undefined}
                    variant="rounded"
                    sx={{
                      width: 48,
                      height: 48,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "white",
                      p: 0.5,
                    }}
                  />

                  <Box flexGrow={1} minWidth={0}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      {application.jobName ||
                        t("dashboard.jobFallback", { id: application.jobId })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {application.companyName || t("dashboard.companyFallback")}
                    </Typography>
                  </Box>

                  <Stack
                    alignItems={{ xs: "flex-start", sm: "flex-end" }}
                    spacing={1}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {t("dashboard.appliedOn", { date: formattedDate })}
                    </Typography>
                    <Chip
                      label={t(`dashboard.status.${application.status}`)}
                      size="small"
                      sx={{
                        color: status.color,
                        bgcolor: status.bg,
                        fontWeight: "bold",
                        borderRadius: 1.5,
                      }}
                    />
                  </Stack>
                </ListItem>
              </Box>
            )
          })}
        </List>
      )}
    </Paper>
  )
}
