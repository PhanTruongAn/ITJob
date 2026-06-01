"use client"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import DescriptionIcon from "@mui/icons-material/Description"
import FavoriteIcon from "@mui/icons-material/Favorite"
import LaunchIcon from "@mui/icons-material/Launch"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import MailIcon from "@mui/icons-material/Mail"
import PaymentsIcon from "@mui/icons-material/Payments"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import SearchIcon from "@mui/icons-material/Search"
import SendIcon from "@mui/icons-material/Send"
import WorkIcon from "@mui/icons-material/Work"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Types
type AppStatus =
  | "hired"
  | "interviewing"
  | "reviewing"
  | "not_selected"
  | "applied"

interface RecentApplication {
  id: number
  jobTitle: string
  company: string
  logo: string
  location: string
  appliedTime: string
  salary?: string
  status: AppStatus
}

interface RecommendedJob {
  id: number
  jobTitle: string
  company: string
  logo: string
  location: string
  salary: string
  tags: string[]
}

// Mock Data
const recentApplications: RecentApplication[] = [
  {
    id: 1,
    jobTitle: "Senior Full Stack Engineer",
    company: "CloudNexus Solutions",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlS6x1wVLH2f6_ItCgLc_KLQlz-2L7MGzeUk0eLqlVixTsiJRIBTm9RJsTjIIOH6gav2C4evh2ic_HkDQzTQR5bZsUW75ebOTA_zmImggcfX9dF5DlsWNpPEoBVlUfU4471AcFDFY_WNuyM5BEAf5G50NCTzxvQUKhHiWgRBTTE9sW2WIWGqXX_KPcJ1xQJYeK5lSWu-BR0jo1E2r2p3Ygh6GBs8ouFhecXRYUewEyXrNAPgY-6h-p46HDVHGBTEaC2c-IjA02Lkw",
    location: "Ho Chi Minh City",
    appliedTime: "2 days ago",
    salary: "$3,500 - $5,000",
    status: "hired",
  },
  {
    id: 2,
    jobTitle: "Senior React Developer",
    company: "Aura Intelligence",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-10mp5hpBYPYACOv0oAE4NVts1w3iicYo1LHmZ6aOjTwy36kjw_b5hjSHkG5-CcBQdzeJHzHZXJ0cb8wjkUjqf9Clb_2RVdNNjZ9vun7hfG6ga_LAwzfGtOqGGFu2DaxH3RUu5ABmX9AHvuomLFFryhv7dFfuAaufrptCkjOwYmJbBrz-Vn3Iq6cN2-lnVIk8DWt1AzADioUj3vYF9hWPV-urnaUgYC6bhh4f4i7z0VtElPJ_HCz6A99WClLoofKHsdE2-eEJnos",
    location: "Remote",
    appliedTime: "1 week ago",
    salary: "$2,800 - $4,200",
    status: "interviewing",
  },
  {
    id: 3,
    jobTitle: "DevOps Engineer",
    company: "FinFlow Banking",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ1Os5R9WU9IdNC0aMIK4PuZq_0uyeeL9jsv9YFPSY7aoJIH7JS7RR-vZKEKJo-Cs_MP2N0whkfS8C2ASnCBnRtWjE5nxZ5_y3Ratx7-BF3-t3yQhubbN_zoqT2AHcvT3DrARG9UTDoB2y3yiQ2Zo4GqlLVOjrL6Gd1JBDbW-CDn1T9sdcD7A6Sg2roc1vtqOQIXzJPfN8m63f-O8rJbkJIsEaaHae1ikxZbSbSo2y72Et4kJExNMhST7RiFcZecK9I8-0WJcFKpM",
    location: "Da Nang, Vietnam",
    appliedTime: "5 days ago",
    status: "reviewing",
  },
]

const recommendedJobs: RecommendedJob[] = [
  {
    id: 101,
    jobTitle: "Senior Frontend Engineer (React/TypeScript)",
    company: "VNG Corporation",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlS6x1wVLH2f6_ItCgLc_KLQlz-2L7MGzeUk0eLqlVixTsiJRIBTm9RJsTjIIOH6gav2C4evh2ic_HkDQzTQR5bZsUW75ebOTA_zmImggcfX9dF5DlsWNpPEoBVlUfU4471AcFDFY_WNuyM5BEAf5G50NCTzxvQUKhHiWgRBTTE9sW2WIWGqXX_KPcJ1xQJYeK5lSWu-BR0jo1E2r2p3Ygh6GBs8ouFhecXRYUewEyXrNAPgY-6h-p46HDVHGBTEaC2c-IjA02Lkw",
    location: "Ho Chi Minh City",
    salary: "$2,500 - $3,800",
    tags: ["ReactJS", "TypeScript", "Next.js"],
  },
  {
    id: 102,
    jobTitle: "Java Backend Tech Lead",
    company: "Techcombank",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-10mp5hpBYPYACOv0oAE4NVts1w3iicYo1LHmZ6aOjTwy36kjw_b5hjSHkG5-CcBQdzeJHzHZXJ0cb8wjkUjqf9Clb_2RVdNNjZ9vun7hfG6ga_LAwzfGtOqGGFu2DaxH3RUu5ABmX9AHvuomLFFryhv7dFfuAaufrptCkjOwYmJbBrz-Vn3Iq6cN2-lnVIk8DWt1AzADioUj3vYF9hWPV-urnaUgYC6bhh4f4i7z0VtElPJ_HCz6A99WClLoofKHsdE2-eEJnos",
    location: "Hanoi, Vietnam",
    salary: "$3,000 - $4,500",
    tags: ["Java", "Spring Boot", "Microservices"],
  },
]

const statusConfig: Record<
  AppStatus,
  { label: string; color: string; bg: string }
> = {
  hired: { label: "Hired", color: "#166534", bg: "#dcfce7" },
  interviewing: { label: "Interviewing", color: "#1e3a8a", bg: "#e0e7ff" },
  reviewing: { label: "Reviewing", color: "#334155", bg: "#f1f5f9" },
  not_selected: { label: "Not Selected", color: "#991b1b", bg: "#fee2e2" },
  applied: { label: "Applied", color: "#0369a1", bg: "#e0f2fe" },
}

export default function CandidateDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <Box p={4}>Loading...</Box>
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Welcome Banner */}
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1e1e2d 0%, #111118 100%)"
              : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          color: "white",
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          mb: 4,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        {/* Abstract design elements */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(229, 57, 53, 0.15)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: "50%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(25, 118, 210, 0.15)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography
              variant="body2"
              sx={{ opacity: 0.8, fontWeight: 600, mb: 1, letterSpacing: 0.5 }}
            >
              CANDIDATE DASHBOARD
            </Typography>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                mb: 1.5,
                background: "linear-gradient(90deg, #ffffff 0%, #ffebee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              👋🏻 Welcome back, {session?.user?.name || "Phan Trường An"}!
            </Typography>
            <Typography
              variant="body1"
              sx={{ opacity: 0.8, maxWidth: 600, mb: 3 }}
            >
              Here&apos;s an overview of your job search progress. Update your
              profile info and review application updates below.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/jobs"
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                Find Jobs
              </Button>
              <Button
                component={Link}
                href="/candidate/itviec-profile"
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Update Profile
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={4}>
        {/* Left Side: Stats & Recent Apps */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3} mb={4}>
            {/* Applied Jobs Card */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 8px 30px rgba(0,0,0,0.06)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CardActionArea
                  component={Link}
                  href="/candidate/my-jobs?status=applied"
                  sx={{ p: 3 }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: "#cee4fe",
                        color: "#0a4c9c",
                        display: "flex",
                      }}
                    >
                      <SendIcon fontSize="small" />
                    </Box>
                    <ChevronRightIcon
                      sx={{ color: "text.secondary", opacity: 0.5 }}
                    />
                  </Box>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    color="text.primary"
                  >
                    3
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                    mt={0.5}
                  >
                    Applied Jobs
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>

            {/* Saved Jobs Card */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 8px 30px rgba(0,0,0,0.06)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CardActionArea
                  component={Link}
                  href="/candidate/my-jobs"
                  sx={{ p: 3 }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: "#fab2b2ff",
                        color: "#991b1b",
                        display: "flex",
                      }}
                    >
                      <FavoriteIcon fontSize="small" />
                    </Box>
                    <ChevronRightIcon
                      sx={{ color: "text.secondary", opacity: 0.5 }}
                    />
                  </Box>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    color="text.primary"
                  >
                    0
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                    mt={0.5}
                  >
                    Saved Jobs
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>

            {/* Job Invitations Card */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 8px 30px rgba(0,0,0,0.06)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CardActionArea
                  component={Link}
                  href="/candidate/job-invitations"
                  sx={{ p: 3 }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: "#d4f7d4ff",
                        color: "#166534",
                        display: "flex",
                      }}
                    >
                      <MailIcon fontSize="small" />
                    </Box>
                    <ChevronRightIcon
                      sx={{ color: "text.secondary", opacity: 0.5 }}
                    />
                  </Box>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    color="text.primary"
                  >
                    0
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                    mt={0.5}
                  >
                    Job invitations
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Applications Section */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Recent Applications
              </Typography>
              <Button
                component={Link}
                href="/candidate/my-jobs"
                size="small"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                sx={{ fontWeight: "bold" }}
              >
                View All
              </Button>
            </Box>

            <List disablePadding>
              {recentApplications.map((app, index) => {
                const statusDetail = statusConfig[app.status]
                return (
                  <Box key={app.id}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}
                    <ListItem
                      disableGutters
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: 2,
                        p: 1,
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: (t) =>
                            t.palette.mode === "dark"
                              ? "rgba(255,255,255,0.03)"
                              : "grey.50",
                        },
                        transition: "bgcolor 0.2s ease",
                      }}
                    >
                      {/* Logo */}
                      <Avatar
                        src={app.logo}
                        variant="rounded"
                        sx={{
                          width: 48,
                          height: 48,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "white",
                          p: 0.5,
                        }}
                      />

                      {/* Job Title & Company */}
                      <Box flexGrow={1}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          {app.jobTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {app.company}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          mt={0.5}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                          >
                            <LocationOnIcon sx={{ fontSize: "0.9rem" }} />{" "}
                            {app.location}
                          </Typography>
                          {app.salary && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="flex"
                              alignItems="center"
                              gap={0.5}
                            >
                              <PaymentsIcon sx={{ fontSize: "0.9rem" }} />{" "}
                              {app.salary}
                            </Typography>
                          )}
                        </Stack>
                      </Box>

                      {/* Right Details: Time & Status */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: { xs: "flex-start", sm: "flex-end" },
                          gap: 1,
                          mt: { xs: 1, sm: 0 },
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Applied {app.appliedTime}
                        </Typography>
                        <Chip
                          label={statusDetail.label}
                          size="small"
                          sx={{
                            color: statusDetail.color,
                            bgcolor: statusDetail.bg,
                            fontWeight: "bold",
                            borderRadius: 1.5,
                          }}
                        />
                      </Box>
                    </ListItem>
                  </Box>
                )
              })}
            </List>
          </Paper>
        </Grid>

        {/* Right Side: Quick Actions & Recommendations */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={4}>
            {/* Quick Actions Card */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="text.primary"
                mb={2.5}
              >
                Quick Actions
              </Typography>

              <Stack spacing={1.5}>
                {/* Profile Edit Action */}
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: "divider",
                    bgcolor: (t) =>
                      t.palette.mode === "dark"
                        ? "background.default"
                        : "grey.50",
                    "&:hover": { borderColor: "primary.main" },
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href="/candidate/itviec-profile"
                    sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}
                  >
                    <Avatar
                      sx={{ bgcolor: "primary.light", color: "primary.main" }}
                    >
                      <PersonOutlineIcon />
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="text.primary"
                      >
                        Update ITviec Profile
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Edit details, location, phone & settings.
                      </Typography>
                    </Box>
                    <ChevronRightIcon
                      sx={{ color: "text.secondary", opacity: 0.5 }}
                    />
                  </CardActionArea>
                </Card>

                {/* CV Attachment Action */}
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: "divider",
                    bgcolor: (t) =>
                      t.palette.mode === "dark"
                        ? "background.default"
                        : "grey.50",
                    "&:hover": { borderColor: "error.main" },
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href="/candidate/cv-attachment"
                    sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}
                  >
                    <Avatar sx={{ bgcolor: "#fee2e2", color: "error.main" }}>
                      <DescriptionIcon />
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="text.primary"
                      >
                        Manage CV Attachments
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Upload or update your CV files.
                      </Typography>
                    </Box>
                    <ChevronRightIcon
                      sx={{ color: "text.secondary", opacity: 0.5 }}
                    />
                  </CardActionArea>
                </Card>

                {/* My Jobs Action */}
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: "divider",
                    bgcolor: (t) =>
                      t.palette.mode === "dark"
                        ? "background.default"
                        : "grey.50",
                    "&:hover": { borderColor: "success.main" },
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href="/candidate/my-jobs"
                    sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}
                  >
                    <Avatar sx={{ bgcolor: "#dcfce7", color: "success.main" }}>
                      <WorkIcon />
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="text.primary"
                      >
                        Track Application Status
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Check updates on your applied jobs.
                      </Typography>
                    </Box>
                    <ChevronRightIcon
                      sx={{ color: "text.secondary", opacity: 0.5 }}
                    />
                  </CardActionArea>
                </Card>
              </Stack>
            </Paper>

            {/* Recommended Jobs Card */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="text.primary"
                mb={2}
              >
                Jobs you may like
              </Typography>

              <Stack spacing={2.5}>
                {recommendedJobs.map((job) => (
                  <Box key={job.id}>
                    <Box
                      display="flex"
                      gap={2}
                      alignItems="flex-start"
                      mb={1.5}
                    >
                      <Avatar
                        src={job.logo}
                        variant="rounded"
                        sx={{
                          width: 40,
                          height: 40,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "white",
                          p: 0.5,
                        }}
                      />
                      <Box flexGrow={1} minWidth={0}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="text.primary"
                          noWrap
                          component={Link}
                          href={`/jobs/${job.id}`}
                          sx={{
                            textDecoration: "none",
                            "&:hover": { color: "primary.main" },
                          }}
                        >
                          {job.jobTitle}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {job.company}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="primary.main"
                          fontWeight="bold"
                          display="block"
                          mt={0.5}
                        >
                          {job.salary}
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        href={`/jobs/${job.id}`}
                        size="small"
                        sx={{ minWidth: 0, p: 0.5 }}
                      >
                        <LaunchIcon fontSize="small" />
                      </Button>
                    </Box>

                    {/* Skill Tags */}
                    <Stack
                      direction="row"
                      spacing={0.5}
                      flexWrap="wrap"
                      gap={0.5}
                    >
                      {job.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            borderRadius: 1,
                            bgcolor: (t) =>
                              t.palette.mode === "dark"
                                ? "grey.800"
                                : "grey.100",
                          }}
                        />
                      ))}
                    </Stack>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Stack>

              <Button
                component={Link}
                href="/jobs"
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2,
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
              >
                Browse More Jobs
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
