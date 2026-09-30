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

interface StatsCardsProps {
  appliedCount?: number
  appliedLoading: boolean
  appliedError: boolean
  retryApplications: () => void
}

export default function StatsCards({
  appliedCount,
  appliedLoading,
  appliedError,
  retryApplications,
}: StatsCardsProps) {
  const { t } = useTranslation()
  const savedJobsQuery = useSavedItemIndex("job")
  const savedCompaniesQuery = useSavedItemIndex("company")

  const cards = [
    {
      key: "applications",
      label: t("dashboard.appliedJobs"),
      count: appliedCount,
      isLoading: appliedLoading,
      isError: appliedError,
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
      onRetry: () => void savedJobsQuery.refetch(),
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
      onRetry: () => void savedCompaniesQuery.refetch(),
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
                  {t("dashboard.notAvailable")}
                </Typography>
              )}
            </CardActionArea>
            {!card.unavailable && card.isError && (
              <Box px={2} pb={1.5}>
                <Typography variant="caption" color="error.main" display="block">
                  {t("dashboard.countLoadError")}
                </Typography>
                <Button size="small" onClick={card.onRetry}>
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
