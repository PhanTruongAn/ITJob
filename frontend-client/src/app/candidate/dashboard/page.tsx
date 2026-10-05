"use client"

import { useMyResumes } from "@/apis/resume.hooks"
import { Box, CircularProgress, Grid, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import QuickActions from "./components/QuickActions"
import RecentApplications from "./components/RecentApplications"
import RecommendedJobs from "./components/RecommendedJobs"
import StatsCards from "./components/StatsCards"
import WelcomeBanner from "./components/WelcomeBanner"

export default function CandidateDashboardPage() {
  const applicationsQuery = useMyResumes()
  const { session, sessionStatus: status, hasCandidateAccess } = applicationsQuery
  const router = useRouter()
  const { t } = useTranslation()
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin")
    } else if (status === "authenticated" && !hasCandidateAccess) {
      router.replace("/")
    }
  }, [status, hasCandidateAccess, router])

  if (status === "loading") {
    return (
      <Box p={4} display="flex" alignItems="center" gap={2}>
        <CircularProgress size={20} />
        <Typography>{t("dashboard.loading")}</Typography>
      </Box>
    )
  }

  if (status === "unauthenticated" || !hasCandidateAccess) {
    return null
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <WelcomeBanner userName={session?.user?.name} />

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <StatsCards
            appliedCount={applicationsQuery.data?.length}
            appliedLoading={applicationsQuery.isLoading}
            appliedError={applicationsQuery.isError}
            retryApplications={() => void applicationsQuery.refetch()}
          />

          <RecentApplications
            applications={applicationsQuery.data?.slice(0, 3) ?? []}
            isLoading={applicationsQuery.isLoading}
            isError={applicationsQuery.isError}
            onRetry={() => void applicationsQuery.refetch()}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box display="flex" flexDirection="column" gap={4}>
            <QuickActions />
            <RecommendedJobs />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
