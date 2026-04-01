"use client"
import JobFiltersSidebar from "@/app/jobs/components/JobFilterSideBar"
import JobList from "@/app/jobs/components/JobList"
import JobSearchBar from "@/app/jobs/components/JobSearchBar"
import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import AppTheme from "@/shared-theme/AppTheme"
import { Box, CssBaseline, Stack } from "@mui/material"
import { Container } from "@mui/system"

export default function JobsPage() {
  // Demo data
  const jobs = [
    {
      title: "Senior Frontend Developer (ReactJS)",
      company: "FPT Software",
      salary: "$1,500 - $2,800",
      location: "Quận 9, TP. Hồ Chí Minh",
      timeAgo: "2 giờ trước",
      tags: ["ReactJS", "TypeScript", "Tailwind CSS"],
      badge: "Hot",
    },
    {
      title: "Backend Engineer (Go/Node.js)",
      company: "VNG Corporation",
      salary: "Thỏa thuận",
      location: "Quận 7, TP. Hồ Chí Minh",
      timeAgo: "5 giờ trước",
      tags: ["Golang", "Node.js", "MySQL"],
      badge: "Mới",
    },
    {
      title: "DevOps Engineer (Kubernetes, AWS)",
      company: "Viettel Group",
      salary: "$2,000 - $3,500",
      location: "Quận Cầu Giấy, Hà Nội",
      timeAgo: "1 ngày trước",
      tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    },
  ]

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: "center",
            // height: "calc((1 - var(--template-frame-height, 0)) * 100%)",
            pt: "calc(40px + var(--template-frame-height, 0px))",
            position: "relative",
            minHeight: "100vh",
          },
          (theme) => ({
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              zIndex: -1,
              inset: 0,
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
              backgroundRepeat: "no-repeat",
              ...theme.applyStyles("dark", {
                backgroundImage:
                  "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
              }),
            },
          }),
        ]}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1400, px: 3, py: 12 }}>
          <JobSearchBar />
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={4}
            alignItems="flex-start"
          >
            <JobFiltersSidebar />
            <JobList jobs={jobs} />
          </Stack>
        </Container>
      </Stack>
      <Box sx={{ bgcolor: "background.paper" }}>
        <Footer />
      </Box>
    </AppTheme>
  )
}
