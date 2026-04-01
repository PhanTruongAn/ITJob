"use client"
import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import AppTheme from "@/shared-theme/AppTheme"
import { Box, CssBaseline } from "@mui/material"
import SideNavBar from "./components/SideNavBar"

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppTheme>
      <CssBaseline />
      <AppAppBar />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          pt: "calc(64px + var(--template-frame-height, 0px))", // Clear AppBar height
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.900" : "#eef2f6",
        }}
      >
        <SideNavBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 3, lg: 5 },
            width: { xs: "100%", lg: "calc(100% - 280px)" }, // Full width minus sidebar on large screens
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </AppTheme>
  )
}
