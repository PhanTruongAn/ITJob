"use client"

import { useCandidateRecommendations } from "@/apis/recommendation/recommendation.hooks"
import JobCard from "@/app/jobs/components/JobCard"
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { useTranslation } from "react-i18next"

const DASHBOARD_RECOMMENDATION_LIMIT = 4

export default function RecommendedJobs() {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useCandidateRecommendations(
    1,
    DASHBOARD_RECOMMENDATION_LIMIT,
  )
  const recommendations = (data?.data?.result ?? []).slice(0, DASHBOARD_RECOMMENDATION_LIMIT)

  return (
    <Box
      component="section"
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2}>
        {t("dashboard.recommendedJobs")}
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={28} aria-label={t("dashboard.loadingRecommendations")} />
        </Box>
      ) : isError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void refetch()}>
              {t("dashboard.retry")}
            </Button>
          }
        >
          {t("dashboard.recommendationsLoadError")}
        </Alert>
      ) : recommendations.length === 0 ? (
        <Box textAlign="center" py={2}>
          <Typography variant="body2" color="text.secondary">
            {t("dashboard.noRecommendations")}
          </Typography>
          <Button component={Link} href="/jobs" sx={{ mt: 1 }}>
            {t("dashboard.browseJobs")}
          </Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          {recommendations.map((recommendation) => (
            <JobCard
              key={recommendation.id}
              id={recommendation.jobId}
              title={recommendation.jobTitle || t("dashboard.jobFallback", { id: recommendation.jobId })}
              company={recommendation.companyName || t("dashboard.companyFallback")}
              companyLogo={recommendation.companyLogo}
              salary={
                recommendation.salary
                  ? `$${recommendation.salary.toLocaleString()}`
                  : t("bookmarks.negotiable")
              }
              location={recommendation.location ?? ""}
              timeAgo={
                recommendation.matchScore === undefined
                  ? ""
                  : t("dashboard.matchScore", {
                      score: Math.round(recommendation.matchScore),
                    })
              }
              tags={recommendation.matchedSkills ?? []}
              jobType={recommendation.jobType}
              level={recommendation.level}
              compact
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}
