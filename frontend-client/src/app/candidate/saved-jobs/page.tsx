"use client"

import { useSavedJobs } from "@/apis/bookmark/bookmark.hooks"
import JobCard from "@/app/jobs/components/JobCard"
import { Alert, Box, Button, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSession } from "next-auth/react"

const PAGE_SIZE = 10

export default function SavedJobsPage() {
  const { t } = useTranslation()
  const { status } = useSession()
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useSavedJobs({ page, size: PAGE_SIZE })
  const savedJobs = data?.data?.result ?? []
  const pagination = data?.data?.meta

  useEffect(() => {
    if (pagination && (pagination.pages === 0 ? page !== 1 : page > pagination.pages)) {
      setPage(pagination.pages || 1)
    }
  }, [page, pagination])

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" fontWeight={700}>
        {t("bookmarks.savedJobs")}
      </Typography>

      {status === "loading" || isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress aria-label={t("common.loading")} />
        </Box>
      ) : isError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              {t("bookmarks.retry")}
            </Button>
          }
        >
          {t("bookmarks.loadJobsError")}
        </Alert>
      ) : savedJobs.length === 0 ? (
        <Box py={8} textAlign="center">
          <Typography color="text.secondary">{t("bookmarks.jobsEmpty")}</Typography>
        </Box>
      ) : (
        <>
          <Stack spacing={2.5}>
            {savedJobs.map((saved) => (
              <JobCard
                key={saved.id}
                id={saved.job.id}
                title={saved.job.name}
                company={saved.job.companyName ?? ""}
                companyLogo={saved.job.companyLogo}
                salary={saved.job.salary ? `$${saved.job.salary.toLocaleString()}` : t("bookmarks.negotiable")}
                location={saved.job.location ?? ""}
                timeAgo=""
                tags={saved.job.jobSkills?.map((skill) => skill.skillName ?? "").filter(Boolean) ?? []}
                jobType={saved.job.jobType}
                level={saved.job.level}
                savedRecord={saved}
              />
            ))}
          </Stack>
          {pagination && pagination.pages > 1 && (
            <Box display="flex" justifyContent="center" pt={2}>
              <Pagination
                count={pagination.pages}
                page={page}
                onChange={(_, nextPage) => setPage(nextPage)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Stack>
  )
}
