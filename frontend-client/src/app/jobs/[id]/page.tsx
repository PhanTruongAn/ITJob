"use client"
import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import AppTheme from "@/shared-theme/AppTheme"
import LaptopMacIcon from "@mui/icons-material/LaptopMac"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"
import PaymentsIcon from "@mui/icons-material/Payments"
import TimerIcon from "@mui/icons-material/Timer"
import { Alert, Box, Container, CssBaseline, Grid, Snackbar } from "@mui/material"
import { useState } from "react"
import JobDescriptionSection from "./components/JobDescriptionSection"
import JobDetailHeader from "./components/JobDetailHeader"
import JobDetailSidebar from "./components/JobDetailSidebar"

// Mock details for job
const jobDetails = {
  id: 1,
  title: "Senior Full Stack Engineer",
  company: "CloudNexus Solutions",
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnMCjxMRkjPVoT3-eFgSccKBJRLUmfaolmdeV7eTgpct3hWgo_bsLNfe-08du959fzx_3lSyBFiQEtimLK5kTNMAjN9jdgWjT0VOMNZkldBaWYWAyN7Ja8lrYdzLhT8WzYJA87zK4OqI-9_DdRbpYoYRhbAVGq68uwiQGvH3mYX3Dd1ITYZsoaJ9YxObBmH17fozXcMdKY9OQCgLGDyqsEpJiO3-kb4XveoEM5J05orioxDOrrj6shaQtiRSemhcJGoGBNn0cHOrU",
  location: "Ho Chi Minh City",
  minSalary: 3500,
  maxSalary: 5000,
  postedTime: "2 days ago",
  companySize: "500+ employees",
  website: "cloudnexus.io",
  companyDesc:
    "CloudNexus Solutions is a leading global technology provider specializing in cloud infrastructure management and enterprise-grade SaaS platforms.",
  description:
    "We are looking for a Senior Full Stack Engineer to join our core architecture team at CloudNexus Solutions. In this role, you will lead the development of high-scale cloud-native applications that serve millions of users globally. You will be responsible for defining technical standards, mentoring junior developers, and collaborating with product managers to deliver world-class enterprise software solutions.",
  responsibilities: [
    "Architect and implement scalable backend services using Node.js and Microservices architecture.",
    "Develop responsive, high-performance web frontends using React and modern state management.",
    "Optimize cloud infrastructure on AWS, ensuring security, reliability, and cost-efficiency.",
    "Conduct thorough code reviews and maintain high standards for automated testing and documentation.",
  ],
  requirementsTags: ["React", "Node.js", "AWS", "TypeScript", "PostgreSQL"],
  requirements: [
    "Minimum 5+ years of experience in full-stack development with a focus on modern JS frameworks.",
    "Strong proficiency in React.js and ecosystem (Redux, Hooks, Next.js).",
    "Hands-on experience with AWS services (EC2, S3, Lambda, RDS).",
    "Excellent problem-solving skills and ability to work in an Agile environment.",
  ],
  benefits: [
    {
      name: "Premium Insurance",
      icon: <MedicalServicesIcon color="success" />,
    },
    { name: "13th-month salary", icon: <PaymentsIcon color="success" /> },
    { name: "Flexible hours", icon: <TimerIcon color="success" /> },
    { name: "Work from home", icon: <LaptopMacIcon color="success" /> },
  ],
}

const similarJobs = [
  {
    id: 101,
    title: "Lead Backend Engineer",
    company: "NexusCore Tech",
    location: "Ho Chi Minh City",
    salary: "$4,000 - $6,000",
  },
  {
    id: 102,
    title: "Senior Frontend Developer",
    company: "Alpha Dynamics",
    location: "District 1",
    salary: "$3,000 - $4,500",
  },
  {
    id: 103,
    title: "Solutions Architect",
    company: "CloudNexus Solutions",
    location: "Remote",
    salary: "$5,000 - $7,500",
  },
]

export default function JobDetailPage() {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const handleApply = () => {
    setSnackbar({
      open: true,
      message: "Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ bạn sớm.",
      severity: "success",
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setSnackbar({
      open: true,
      message: "Đã sao chép liên kết vào bộ nhớ tạm!",
      severity: "info",
    })
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar />

      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.900" : "grey.50",
          pt: 12,
          pb: 10,
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <JobDetailHeader
            job={jobDetails}
            isBookmarked={isBookmarked}
            onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
            onApply={handleApply}
          />

          {/* Grid Layout */}
          <Grid container spacing={4}>
            {/* Left Content Area */}
            <Grid item xs={12} lg={8}>
              <JobDescriptionSection job={jobDetails} />
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              <JobDetailSidebar
                job={jobDetails}
                similarJobs={similarJobs}
                onCopyLink={handleCopyLink}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Snackbar notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity as any}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
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
