"use client"

import { useSavedCompanies } from "@/apis/bookmark/bookmark.hooks"
import CompanyCard from "@/app/companies/components/CompanyCard"
import { Alert, Box, Button, CircularProgress, Grid, Pagination, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSession } from "next-auth/react"

const PAGE_SIZE = 9

export default function SavedCompaniesPage() {
  const { t } = useTranslation()
  const { status } = useSession()
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useSavedCompanies({ page, size: PAGE_SIZE })
  const savedCompanies = data?.data?.result ?? []
  const pagination = data?.data?.meta

  useEffect(() => {
    if (pagination && (pagination.pages === 0 ? page !== 1 : page > pagination.pages)) {
      setPage(pagination.pages || 1)
    }
  }, [page, pagination])

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" fontWeight={700}>
        {t("bookmarks.savedCompanies")}
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
          {t("bookmarks.loadCompaniesError")}
        </Alert>
      ) : savedCompanies.length === 0 ? (
        <Box py={8} textAlign="center">
          <Typography color="text.secondary">{t("bookmarks.companiesEmpty")}</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {savedCompanies.map((saved) => (
              <Grid item xs={12} sm={6} lg={4} key={saved.id}>
                <CompanyCard
                  id={saved.company.id}
                  name={saved.company.name}
                  logo={saved.company.logo}
                  industry={saved.company.industry}
                  rating={saved.company.rating}
                  reviews={saved.company.reviews}
                  description={saved.company.description}
                  jobCount={saved.company.jobCount}
                  savedRecord={saved}
                />
              </Grid>
            ))}
          </Grid>
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
