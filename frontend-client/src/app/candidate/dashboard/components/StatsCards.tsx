"use client"

import { useSavedItemIndex } from "@/apis/bookmark/bookmark.hooks"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import FavoriteIcon from "@mui/icons-material/Favorite"
import MailIcon from "@mui/icons-material/Mail"
import SendIcon from "@mui/icons-material/Send"
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import useGuardedRefetch from "@/common/hooks/useGuardedRefetch"

interface StatsCardsProps {
  appliedCount?: number
  appliedLoading: boolean
  appliedError: boolean
  retryApplications: () => void
  appliedRetrying: boolean
}

export default function StatsCards({
  appliedCount,
  appliedLoading,
  appliedError,
  retryApplications,
  appliedRetrying,
}: StatsCardsProps) {
  const { t } = useTranslation()
  const savedJobsQuery = useSavedItemIndex("job")
  const savedCompaniesQuery = useSavedItemIndex("company")
  const savedJobsRetry = useGuardedRefetch(savedJobsQuery.refetch, savedJobsQuery.isFetching)
  const savedCompaniesRetry = useGuardedRefetch(savedCompaniesQuery.refetch, savedCompaniesQuery.isFetching)

  const cards = [
    {
      key: "applications",
      label: t("dashboard.appliedJobs"),
      count: appliedCount,
      isLoading: appliedLoading,
      isError: appliedError,
      retrying: appliedRetrying,
      onRetry: retryApplications,
      href: "/candidate/my-jobs",
      icon: <SendIcon fontSize="small" />,
      iconBg: "#cee4fe",
      iconColor: "#0a4c9c",
    },
    {
      key: "savedJobs",
      label: t("dashboard.savedJobs"),
      count: savedJobsQuery.data?.length,
      isLoading: savedJobsQuery.isLoading,
      isError: savedJobsQuery.isError,
      retrying: savedJobsRetry.isBusy,
      onRetry: () => void savedJobsRetry.handleRefetch(),
      href: "/candidate/saved-jobs",
      icon: <FavoriteIcon fontSize="small" />,
      iconBg: "#fab2b2ff",
      iconColor: "#991b1b",
    },
    {
      key: "savedCompanies",
      label: t("dashboard.savedCompanies"),
      count: savedCompaniesQuery.data?.length,
      isLoading: savedCompaniesQuery.isLoading,
      isError: savedCompaniesQuery.isError,
      retrying: savedCompaniesRetry.isBusy,
      onRetry: () => void savedCompaniesRetry.handleRefetch(),
      href: "/candidate/saved-companies",
      icon: <FavoriteIcon fontSize="small" />,
      iconBg: "#e9d5ff",
      iconColor: "#6b21a8",
    },
    {
      key: "invitations",
      label: t("dashboard.invitations"),
      unavailable: true,
      href: "/candidate/job-invitations",
      icon: <MailIcon fontSize="small" />,
      iconBg: "#d4f7d4ff",
      iconColor: "#166534",
    },
  ]

  return (
    <Grid container spacing={3} mb={4}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} key={card.key}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0px 8px 30px rgba(0,0,0,0.06)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardActionArea component={Link} href={card.href} sx={{ p: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    bgcolor: card.iconBg,
                    color: card.iconColor,
                    display: "flex",
                  }}
                >
                  {card.icon}
                </Box>
                <ChevronRightIcon
                  sx={{ color: "text.secondary", opacity: 0.5 }}
                />
              </Box>
              <Typography variant="h3" fontWeight={900} color="text.primary">
                {card.unavailable ? (
                  "—"
                ) : card.isLoading ? (
                  <CircularProgress size={24} />
                ) : card.isError || card.count === undefined ? (
                  "—"
                ) : (
                  card.count
                )}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
                mt={0.5}
              >
                {card.label}
              </Typography>
              {card.unavailable && (
                <Typography variant="caption" color="text.secondary">
                  {t("jobInvitations.notAvailable")}
                </Typography>
              )}
            </CardActionArea>
            {!card.unavailable && card.isError && (
              <Box px={2} pb={1.5}>
                <Typography variant="caption" color="error.main" display="block">
                  {t("dashboard.countLoadError")}
                </Typography>
                <Button size="small" loading={card.retrying} disabled={card.retrying} onClick={card.onRetry}>
                  {t("dashboard.retry")}
                </Button>
              </Box>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
