"use client"
import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import AppTheme from "@/shared-theme/AppTheme"
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material"
import { use, useState } from "react"
import CompanyAboutTab from "./components/CompanyAboutTab"
import CompanyReviewsTab from "./components/CompanyReviewsTab"
import CompanyJobsTab from "./components/CompanyJobsTab"
import CompanyCoverHeader from "./components/CompanyCoverHeader"
import CompanyNavTabs from "./components/CompanyNavTabs"
import CompanyProfileHeader from "./components/CompanyProfileHeader"
import CompanySidebarContact from "./components/CompanySidebarContact"
import CompanySidebarLocations from "./components/CompanySidebarLocations"
import { useCompanyDetail } from "@/apis/company/company.hooks"
import { useFollowStatus, useToggleFollowCompany } from "@/apis/follow/follow.hooks"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default function CompanyDetailPage({ params }: Props) {
  const { id } = use(params)
  const companyId = Number(id)
  const router = useRouter()
  const { data: session, status } = useSession()

  const [activeTab, setActiveTab] = useState("about")
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info" | "warning"
  }>({
    open: false,
    message: "",
    severity: "success",
  })

  const { data, isLoading, isError } = useCompanyDetail(companyId)

  // Fetch follow status only if user is logged in
  const isLoggedIn = status === "authenticated"
  const { data: followStatusData, isLoading: isFollowStatusLoading } = useFollowStatus(
    companyId,
    isLoggedIn
  )
  const isFollowing = !!followStatusData?.data

  const toggleFollowMutation = useToggleFollowCompany()
  const company = data?.data

  const handleFollowToggle = () => {
    if (status !== "authenticated") {
      setSnackbar({
        open: true,
        message: "Vui lòng đăng nhập để theo dõi công ty này!",
        severity: "warning",
      })
      setTimeout(() => {
        router.push("/signin")
      }, 1500)
      return
    }

    toggleFollowMutation.mutate(companyId, {
      onSuccess: (res) => {
        const isActive = res?.data?.active
        const companyName = company?.name || res?.data?.companyName || "công ty"
        if (isActive) {
          setSnackbar({
            open: true,
            message: `Đã theo dõi công ty ${companyName} thành công!`,
            severity: "success",
          })
        } else {
          setSnackbar({
            open: true,
            message: `Đã hủy theo dõi công ty ${companyName}.`,
            severity: "info",
          })
        }
      },
      onError: (error: any) => {
        setSnackbar({
          open: true,
          message:
            error?.response?.data?.message ||
            "Có lỗi xảy ra khi thực hiện thao tác theo dõi.",
          severity: "error",
        })
      },
    })
  }

  if (isLoading) {
    return (
      <AppTheme>
        <CssBaseline />
        <AppAppBar />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={48} />
        </Box>
      </AppTheme>
    )
  }

  if (isError || !company) {
    return (
      <AppTheme>
        <CssBaseline />
        <AppAppBar />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary" variant="h6">
            Không tìm thấy thông tin công ty.
          </Typography>
        </Box>
      </AppTheme>
    )
  }

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
            theme.palette.mode === "dark"
              ? "backgroundDark"
              : "backgroundLight",
          pb: 10,
        }}
      >
        <CompanyCoverHeader />

        <CompanyProfileHeader
          name={company.name}
          logo={company.logo}
          tagline={company.industry ?? ""}
          location={company.address ?? company.country?.name ?? ""}
          industry={company.companyType ?? ""}
          employeeCount={company.companySize ?? ""}
          rating={company.rating}
          reviews={company.reviews}
          badge={company.badge}
          isVerified={company.status === "APPROVED"}
          isFollowing={isFollowing}
          isFollowingLoading={isFollowStatusLoading || toggleFollowMutation.isPending}
          onFollow={handleFollowToggle}
          onVisitWebsite={
            company.website
              ? () => window.open(company.website, "_blank")
              : undefined
          }
        />

        <Box sx={{ mt: 4 }}>
          <CompanyNavTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            jobCount={company.jobCount}
            reviewCount={company.reviews}
          />
        </Box>

        <Container maxWidth="lg" sx={{ mt: 5 }}>
          <Grid container spacing={5}>
            {/* Left Content Area */}
            <Grid item xs={12} lg={8}>
              {activeTab === "about" && (
                <CompanyAboutTab
                  description={company.description}
                  workingDays={company.workingDays}
                  overtime={company.overtime}
                />
              )}
              {activeTab === "jobs" && (
                <CompanyJobsTab companyId={companyId} />
              )}
              {activeTab === "reviews" && (
                <CompanyReviewsTab
                  companyId={companyId}
                  rating={company.rating ?? 0}
                  totalReviews={company.reviews ?? 0}
                />
              )}
              {activeTab !== "about" &&
                activeTab !== "jobs" &&
                activeTab !== "reviews" && (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      bgcolor: "background.paper",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      Nội dung phần {activeTab} đang được cập nhật...
                    </Typography>
                  </Box>
                )}
            </Grid>

            {/* Sidebar Area */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                <CompanySidebarContact
                  address={company.address}
                  phone={company.phone}
                  email={company.email}
                  website={company.website}
                />
                <CompanySidebarLocations
                  address={company.address}
                  countryName={company.country?.name}
                />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Follow / Unfollow Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Footer />
      </Box>
    </AppTheme>
  )
}
