"use client"

import { useMyResumes } from "@/apis/resume.hooks"
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import ApplicationCard from "./components/ApplicationCard"
import FilterTabBar, { FilterTab } from "./components/FilterTabBar"
import StatsBentoGrid from "./components/StatsBentoGrid"

export default function MyJobsPage() {
  const applicationsQuery = useMyResumes()
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const resumes = applicationsQuery.data ?? []

  useEffect(() => {
    if (applicationsQuery.sessionStatus === "unauthenticated") {
      router.replace("/signin")
    } else if (
      applicationsQuery.sessionStatus === "authenticated" &&
      !applicationsQuery.hasCandidateAccess
    ) {
      router.replace("/")
    }
  }, [applicationsQuery.sessionStatus, applicationsQuery.hasCandidateAccess, router])

  const reviewing = resumes.filter(
    (resume) => resume.status === "PENDING" || resume.status === "REVIEWING",
  ).length
  const approved = resumes.filter((resume) => resume.status === "APPROVED").length
  const rejected = resumes.filter((resume) => resume.status === "REJECTED").length
  const stats = [
    { label: t("myApplications.stats.total"), value: resumes.length, sub: null, subColor: null },
    { label: t("myApplications.stats.inProgress"), value: reviewing, sub: null, subColor: null },
    { label: t("myApplications.stats.approved"), value: approved, sub: null, subColor: null, isPositive: true },
    { label: t("myApplications.stats.rejected"), value: rejected, sub: null, subColor: null },
  ]

  const filteredResumes =
    activeFilter === "all"
      ? resumes
      : resumes.filter((resume) => resume.status === activeFilter)

  if (applicationsQuery.sessionStatus === "loading") {
    return (
      <Box role="status" display="flex" alignItems="center" justifyContent="center" gap={2} py={8}>
        <CircularProgress size={22} />
        <Typography>{t("myApplications.loading")}</Typography>
      </Box>
    )
  }

  if (!applicationsQuery.hasCandidateAccess) return null

  return (
    <Box>
      <Box mb={5}>
        <Typography variant="h4" fontWeight={900} color="primary.main" gutterBottom>
          {t("myApplications.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("myApplications.subtitle")}
        </Typography>
      </Box>

      {applicationsQuery.isLoading ? (
        <Box role="status" display="flex" alignItems="center" justifyContent="center" gap={2} py={8}>
          <CircularProgress color="primary" />
          <Typography>{t("myApplications.loading")}</Typography>
        </Box>
      ) : applicationsQuery.isError ? (
        <Alert
          severity="error"
          action={<Button color="inherit" size="small" onClick={() => void applicationsQuery.refetch()}>{t("myApplications.retry")}</Button>}
        >
          {t("myApplications.error")}
        </Alert>
      ) : (
        <>
          <StatsBentoGrid stats={stats} />
          <FilterTabBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          {resumes.length === 0 ? (
            <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t("myApplications.noApplications")}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {t("myApplications.noApplicationsDescription")}
              </Typography>
              <Button component={Link} href="/jobs" variant="contained">
                {t("myApplications.findJobs")}
              </Button>
            </Paper>
          ) : filteredResumes.length > 0 ? (
            <Stack spacing={2.5}>
              {filteredResumes.map((resume) => (
                <ApplicationCard key={resume.id} app={resume} locale={i18n.language} />
              ))}
            </Stack>
          ) : (
            <Paper elevation={0} sx={{ p: 5, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", textAlign: "center" }}>
              <Typography color="text.secondary" gutterBottom>{t("myApplications.emptyFiltered")}</Typography>
              <Button onClick={() => setActiveFilter("all")}>{t("myApplications.showAll")}</Button>
            </Paper>
          )}
        </>
      )}
    </Box>
  )
}
