"use client"

import { QUERY_KEYS } from "@/common/queryKeys"
import { isCandidateRole } from "@/common/security/frontendSecurity.mjs"
import CustomHooks from "@/common/hooks/customHooks"
import { getMyResumes } from "@/apis/resume"
import { Box, CircularProgress, Grid, Typography } from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import QuickActions from "./components/QuickActions"
import RecentApplications from "./components/RecentApplications"
import RecommendedJobs from "./components/RecommendedJobs"
import StatsCards from "./components/StatsCards"
import WelcomeBanner from "./components/WelcomeBanner"

export default function CandidateDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useTranslation()
  const candidateId = session?.user?.id
  const hasCandidateAccess =
    status === "authenticated" && isCandidateRole(session?.user?.role)

  const applicationsQuery = CustomHooks.useQuery(
    [QUERY_KEYS.USER_MODULE, "my-resumes", candidateId ?? "anonymous"],
    async () => {
      const response = await getMyResumes()
      if (!Array.isArray(response.data)) {
        throw new Error("Candidate applications response was invalid")
      }
      return response.data
    },
    {
      enabled: hasCandidateAccess && !!candidateId,
      staleTime: 30_000,
      placeholderData: undefined,
    },
  )

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
