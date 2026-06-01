"use client"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import BusinessIcon from "@mui/icons-material/Business"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PaymentsIcon from "@mui/icons-material/Payments"
import ScheduleIcon from "@mui/icons-material/Schedule"
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Chip,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material"

interface JobDetails {
  title: string
  company: string
  logo: string
  location: string
  minSalary: number
  maxSalary: number
  postedTime: string
}

interface JobDetailHeaderProps {
  job: JobDetails
  isBookmarked: boolean
  onBookmarkToggle: () => void
  onApply: () => void
}

export default function JobDetailHeader({
  job,
  isBookmarked,
  onBookmarkToggle,
  onApply,
}: JobDetailHeaderProps) {
  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<ChevronRightIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 4 }}
      >
        <Link
          underline="hover"
          color="inherit"
          href="/jobs"
          sx={{ fontSize: "0.875rem" }}
        >
          Jobs
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          sx={{ fontSize: "0.875rem" }}
        >
          {job.company}
        </Link>
        <Typography
          color="text.primary"
          sx={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          {job.title}
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
                src={job.logo}
                alt={job.company}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>
            <Box>
              <Typography
                variant="h4"
                fontWeight="800"
                sx={{ letterSpacing: "-0.5px", mb: 1, color: "text.primary" }}
              >
                {job.title}
              </Typography>

              <Stack
                direction="row"
                flexWrap="wrap"
                gap={{ xs: 1.5, sm: 3 }}
                alignItems="center"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{ color: "primary.main", fontWeight: 500 }}
                >
                  <BusinessIcon fontSize="small" />
                  <Typography variant="body2">{job.company}</Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{ color: "text.secondary" }}
                >
                  <LocationOnIcon fontSize="small" />
                  <Typography variant="body2">{job.location}</Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{ color: "success.main", fontWeight: "bold" }}
                >
                  <PaymentsIcon fontSize="small" />
                  <Typography variant="body2">
                    ${job.minSalary.toLocaleString()} - $
                    {job.maxSalary.toLocaleString()}
                  </Typography>
                </Box>
                <Chip
                  icon={<ScheduleIcon sx={{ fontSize: "14px !important" }} />}
                  label={job.postedTime}
                  size="small"
                  sx={{
                    fontSize: "0.75rem",
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "grey.100",
                  }}
                />
              </Stack>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={onApply}
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
              onClick={onBookmarkToggle}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                color: isBookmarked ? "error.main" : "text.secondary",
                bgcolor: isBookmarked
                  ? "rgba(220, 38, 38, 0.05)"
                  : "transparent",
                p: 1.5,
                "&:hover": {
                  bgcolor: isBookmarked
                    ? "rgba(220, 38, 38, 0.1)"
                    : "action.hover",
                },
              }}
            >
              {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Stack>
        </Box>
      </Card>
    </>
  )
}
