"use client"
import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import AppTheme from "@/shared-theme/AppTheme"
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Stack,
  Typography,
  Chip,
  IconButton,
  Card,
  Breadcrumbs,
  Link,
  Divider,
  Avatar,
  Theme,
} from "@mui/material"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import BusinessIcon from "@mui/icons-material/Business"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PaymentsIcon from "@mui/icons-material/Payments"
import ScheduleIcon from "@mui/icons-material/Schedule"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import TerminalIcon from "@mui/icons-material/Terminal"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"
import TimerIcon from "@mui/icons-material/Timer"
import LaptopMacIcon from "@mui/icons-material/LaptopMac"
import GroupsIcon from "@mui/icons-material/Groups"
import LanguageIcon from "@mui/icons-material/Language"
import ShareIcon from "@mui/icons-material/Share"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import MailIcon from "@mui/icons-material/Mail"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"

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
  companyDesc: "CloudNexus Solutions is a leading global technology provider specializing in cloud infrastructure management and enterprise-grade SaaS platforms.",
  description: "We are looking for a Senior Full Stack Engineer to join our core architecture team at CloudNexus Solutions. In this role, you will lead the development of high-scale cloud-native applications that serve millions of users globally. You will be responsible for defining technical standards, mentoring junior developers, and collaborating with product managers to deliver world-class enterprise software solutions.",
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
    { name: "Premium Insurance", icon: <MedicalServicesIcon color="success" /> },
    { name: "13th-month salary", icon: <PaymentsIcon color="success" /> },
    { name: "Flexible hours", icon: <TimerIcon color="success" /> },
    { name: "Work from home", icon: <LaptopMacIcon color="success" /> },
  ]
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
  const params = useParams()
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

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
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<ChevronRightIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 4 }}
          >
            <Link underline="hover" color="inherit" href="/jobs" sx={{ fontSize: "0.875rem" }}>
              Jobs
            </Link>
            <Link underline="hover" color="inherit" href="#" sx={{ fontSize: "0.875rem" }}>
              {jobDetails.company}
            </Link>
            <Typography color="text.primary" sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
              {jobDetails.title}
            </Typography>
          </Breadcrumbs>

          {/* Hero Section */}
          <Card
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                gap: 4,
              }}
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={jobDetails.logo}
                    alt={jobDetails.company}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="800"
                    sx={{ letterSpacing: "-0.5px", mb: 1, color: "text.primary" }}
                  >
                    {jobDetails.title}
                  </Typography>

                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={{ xs: 1.5, sm: 3 }}
                    alignItems="center"
                  >
                    <Box display="flex" alignItems="center" gap={0.5} sx={{ color: "primary.main", fontWeight: 500 }}>
                      <BusinessIcon fontSize="small" />
                      <Typography variant="body2">{jobDetails.company}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5} sx={{ color: "text.secondary" }}>
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2">{jobDetails.location}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5} sx={{ color: "success.main", fontWeight: "bold" }}>
                      <PaymentsIcon fontSize="small" />
                      <Typography variant="body2">
                        ${jobDetails.minSalary.toLocaleString()} - ${jobDetails.maxSalary.toLocaleString()}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<ScheduleIcon sx={{ fontSize: "14px !important" }} />}
                      label={jobDetails.postedTime}
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "grey.100",
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} sx={{ width: { xs: "100%", md: "auto" } }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApply}
                  sx={{
                    flexGrow: 1,
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "primary.dark", boxShadow: "none" },
                  }}
                >
                  Apply Now
                </Button>
                <IconButton
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    color: isBookmarked ? "error.main" : "text.secondary",
                    bgcolor: isBookmarked ? "rgba(220, 38, 38, 0.05)" : "transparent",
                    p: 1.5,
                    "&:hover": {
                      bgcolor: isBookmarked ? "rgba(220, 38, 38, 0.1)" : "action.hover",
                    },
                  }}
                >
                  {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Stack>
            </Box>
          </Card>

          {/* Grid Layout */}
          <Grid container spacing={4}>
            {/* Left Content Area */}
            <Grid item xs={12} lg={8}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                {/* Description */}
                <Box mb={4}>
                  <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                    Job Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {jobDetails.description}
                  </Typography>
                </Box>

                {/* Responsibilities */}
                <Box mb={4}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Box sx={{ width: 4, height: 20, bgcolor: "primary.main", borderRadius: 1 }} />
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      Responsibilities
                    </Typography>
                  </Stack>
                  <Stack spacing={1.5}>
                    {jobDetails.responsibilities.map((resp, i) => (
                      <Box key={i} display="flex" alignItems="flex-start" gap={1.5}>
                        <CheckCircleIcon sx={{ color: "primary.main", fontSize: 20, mt: 0.3 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {resp}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Requirements */}
                <Box mb={4}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Box sx={{ width: 4, height: 20, bgcolor: "primary.main", borderRadius: 1 }} />
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      Requirements
                    </Typography>
                  </Stack>

                  <Stack direction="row" gap={1} flexWrap="wrap" mb={3}>
                    {jobDetails.requirementsTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag.toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          bgcolor: "rgba(0, 43, 92, 0.05)",
                          color: "primary.main",
                          borderRadius: 999,
                        }}
                      />
                    ))}
                  </Stack>

                  <Stack spacing={1.5}>
                    {jobDetails.requirements.map((req, i) => (
                      <Box key={i} display="flex" alignItems="flex-start" gap={1.5}>
                        <TerminalIcon sx={{ color: "primary.main", fontSize: 20, mt: 0.3 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {req}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Benefits */}
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
                    <Box sx={{ width: 4, height: 20, bgcolor: "primary.main", borderRadius: 1 }} />
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      Benefits
                    </Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    {jobDetails.benefits.map((benefit, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: (theme: Theme) =>
                              theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "grey.50",
                            border: "1px solid",
                            borderColor: "divider",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: (theme: Theme) =>
                                theme.palette.mode === "dark" ? "grey.800" : "success.light",
                              color: "success.main",
                              borderRadius: 2,
                            }}
                          >
                            {benefit.icon}
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium" color="text.primary">
                            {benefit.name}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Card>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                {/* About Company */}
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary" mb={3}>
                    About the Company
                  </Typography>
                  <Stack spacing={2.5}>
                    <Box display="flex" alignItems="center" gap={2} p={2} sx={{ bgcolor: "grey.50", borderRadius: 2 }}>
                      <GroupsIcon sx={{ color: "primary.main" }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: "bold" }}>
                          Size
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="text.primary">
                          {jobDetails.companySize}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2} p={2} sx={{ bgcolor: "grey.50", borderRadius: 2 }}>
                      <LanguageIcon sx={{ color: "primary.main" }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: "bold" }}>
                          Website
                        </Typography>
                        <Link
                          href="#"
                          underline="hover"
                          sx={{
                            typography: "body2",
                            fontWeight: "bold",
                            color: "primary.main",
                          }}
                        >
                          {jobDetails.website}
                        </Link>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {jobDetails.companyDesc}
                    </Typography>
                  </Stack>
                </Card>

                {/* Similar Jobs */}
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary" mb={3}>
                    Similar Jobs
                  </Typography>
                  <Stack spacing={2}>
                    {similarJobs.map((simJob) => (
                      <Box
                        key={simJob.id}
                        onClick={() => router.push(`/jobs/${simJob.id}`)}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid transparent",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "grey.50",
                            borderColor: "divider",
                            "& h4": { color: "primary.main" },
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          component="h4"
                          color="text.primary"
                          sx={{ transition: "color 0.2s ease", mb: 0.5 }}
                        >
                          {simJob.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                          {simJob.company} • {simJob.location}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          {simJob.salary}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>

                {/* Share Job */}
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 2 }}
                  >
                    Share this job
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <IconButton
                      sx={{
                        bgcolor: "grey.100",
                        color: "text.primary",
                        "&:hover": { bgcolor: "primary.light", color: "primary.contrastText" },
                      }}
                    >
                      <ShareIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={handleCopyLink}
                      sx={{
                        bgcolor: "grey.100",
                        color: "text.primary",
                        "&:hover": { bgcolor: "primary.light", color: "primary.contrastText" },
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      sx={{
                        bgcolor: "grey.100",
                        color: "text.primary",
                        "&:hover": { bgcolor: "primary.light", color: "primary.contrastText" },
                      }}
                    >
                      <MailIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Card>
              </Stack>
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
