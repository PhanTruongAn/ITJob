"use client"
import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import AppTheme from "@/shared-theme/AppTheme"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  Pagination as MuiPagination,
  PaginationItem,
  Skeleton,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useCompanies } from "@/apis/company/company.hooks"
import { CompanyTypeEnum } from "@/apis/company/company.types"
import CompanyCard from "./components/CompanyCard"
import CompanyFilters from "./components/CompanyFilters"
import CompanyHero from "./components/CompanyHero"

export default function CompaniesPage() {
  const [page, setPage] = useState(1)
  const [size] = useState(6)

  // Controlled inputs inside Hero
  const [keywordInput, setKeywordInput] = useState("")
  const [addressInput, setAddressInput] = useState("")

  // Search parameters submitted to API
  const [searchKeyword, setSearchKeyword] = useState("")
  const [searchAddress, setSearchAddress] = useState("")

  // Selected companyType tab
  const [companyType, setCompanyType] = useState<string>("all")

  // API Call using hook
  const { data, isLoading } = useCompanies({
    page,
    size,
    name: searchKeyword || undefined,
    address: searchAddress || undefined,
    companyType: companyType !== "all" ? (companyType as CompanyTypeEnum) : undefined,
  })

  const handleSearch = () => {
    setSearchKeyword(keywordInput)
    setSearchAddress(addressInput)
    setPage(1)
  }

  const handleFilterChange = (filter: string) => {
    setCompanyType(filter)
    setPage(1)
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const companiesList = data?.data?.result || []
  const paginationMeta = data?.data?.meta

  return (
    <AppTheme>
      <CssBaseline />
      <AppAppBar />

      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.900" : "grey.50",
        }}
      >
        <CompanyHero
          keyword={keywordInput}
          setKeyword={setKeywordInput}
          address={addressInput}
          setAddress={setAddressInput}
          onSearch={handleSearch}
        />

        <Box sx={{ width: "100%", bgcolor: "background.default" }}>
          <CompanyFilters
            activeFilter={companyType}
            onChangeFilter={handleFilterChange}
          />

          <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, pb: 10 }}>
            <Grid container spacing={3}>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                      }}
                    >
                      <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2, mb: 2 }} />
                      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
                      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
                      <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                    </Box>
                  </Grid>
                ))
              ) : companiesList.length === 0 ? (
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    py={10}
                  >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Không tìm thấy công ty nào phù hợp.
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                companiesList.map((company) => (
                  <Grid item xs={12} sm={6} md={4} key={company.id}>
                    <CompanyCard {...company} />
                  </Grid>
                ))
              )}
            </Grid>

            {/* Pagination Component */}
            {paginationMeta && paginationMeta.pages > 1 && (
              <Box display="flex" justifyContent="center" mt={6}>
                <MuiPagination
                  count={paginationMeta.pages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  renderItem={(item) => (
                    <PaginationItem
                      slots={{
                        previous: ChevronLeftIcon,
                        next: ChevronRightIcon,
                      }}
                      {...item}
                    />
                  )}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                    },
                    "& .Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Container>
        </Box>
      </Box>

      {/* Re-use global Footer */}
      <Box sx={{ bgcolor: "background.paper" }}>
        <Footer />
      </Box>
    </AppTheme>
  )
}
