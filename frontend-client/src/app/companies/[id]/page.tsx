"use client"
import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import AppTheme from "@/shared-theme/AppTheme"
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  Stack,
  Typography,
} from "@mui/material"
import { useState } from "react"
import CompanyAboutTab from "./components/CompanyAboutTab"
import CompanyReviewsTab from "./components/CompanyReviewsTab"
import CompanyJobsTab from "./components/CompanyJobsTab"
import CompanyCoverHeader from "./components/CompanyCoverHeader"
import CompanyNavTabs from "./components/CompanyNavTabs"
import CompanyProfileHeader from "./components/CompanyProfileHeader"
import CompanySidebarContact from "./components/CompanySidebarContact"
import CompanySidebarLocations from "./components/CompanySidebarLocations"

export default function CompanyDetailPage() {
  const [activeTab, setActiveTab] = useState("about")

  // Mock data for FPT Software
  const companyData = {
    name: "FPT Software",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhNiOsUE8PVn2jTocyJXUkvQxT7rMo_XGPIlApNSBQ8kuCYWG_eQ5aHMxgkpHjQf11DnFDMpAUqYZW5rAOgTY14rTtmfhCJIYxp8yZoggW9l0u-_kiaqX8zcKGClDxaCAizlkr4jV3OzhFAY8l_hsDYlejc8t9jQSuuCo9p-Ee2FCUcO28AkbxO8p8txGJ2uM8IZk-CLCfBN36iO7G4F8LjMbulcHbDo1sUJ0JoIZrWD72oVqdyQXt173r0uHINOAijfcS5aLGPew",
    tagline: "Leading Global Technology & IT Services Provider",
    location: "Hanoi, Vietnam",
    industry: "IT Services",
    employeeCount: "30,000+ Employees",
    isVerified: true,
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
          {...companyData}
          onFollow={() => console.log("Followed")}
          onVisitWebsite={() =>
            window.open("https://www.fpt-software.com", "_blank")
          }
        />

        <Box sx={{ mt: 4 }}>
          <CompanyNavTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </Box>

        <Container maxWidth="lg" sx={{ mt: 5 }}>
          <Grid container spacing={5}>
            {/* Left Content Area */}
            <Grid item xs={12} lg={8}>
              {activeTab === "about" && <CompanyAboutTab />}
              {activeTab === "jobs" && <CompanyJobsTab />}
              {activeTab === "reviews" && <CompanyReviewsTab />}
              {activeTab !== "about" && activeTab !== "jobs" && activeTab !== "reviews" && (
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
                <CompanySidebarContact />
                <CompanySidebarLocations />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

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
