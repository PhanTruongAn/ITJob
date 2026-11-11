"use client"
import { fetchCompanies } from "@/apis/company"
import Avatar from "@mui/material/Avatar"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import Skeleton from "@mui/material/Skeleton"
import Typography from "@mui/material/Typography"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export default function TopEmployers() {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["companies", "top"],
    queryFn: () => fetchCompanies({ page: 1, pageSize: 6 }),
  })

  const companies = data?.data?.result ?? []

  return (
    <Box sx={{ py: 8, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Typography variant="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          {t("home.topEmployers", "Nhà tuyển dụng hàng đầu")}
        </Typography>
        {isError && (
          <Alert
            severity="error"
            action={<Button color="inherit" size="small" onClick={() => void refetch()}>{t("home.retry")}</Button>}
            sx={{ mb: 3 }}
          >
            {t("home.loadError")}
          </Alert>
        )}
        {!isLoading && !isError && companies.length === 0 && (
          <Typography color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            {t("home.noEmployers")}
          </Typography>
        )}
        <Grid container spacing={4}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Grid size={{ xs: 6, md: 2 }} key={i}>
                  <Skeleton
                    variant="circular"
                    width={80}
                    height={80}
                    sx={{ mx: "auto", mb: 2 }}
                  />
                  <Skeleton width="100%" />
                </Grid>
              ))
            : companies.map((comp: any) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={comp.id}>
                  <Card
                    sx={{
                      p: 3,
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      src={comp.logo}
                      variant="rounded"
                      sx={{ width: 80, height: 80, bgcolor: "primary.light" }}
                    >
                {comp.name?.[0] ?? "?"}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {comp.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {comp.address}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  )
}
