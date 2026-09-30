"use client"
import BusinessIcon from "@mui/icons-material/Business"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import EventIcon from "@mui/icons-material/Event"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PaymentsIcon from "@mui/icons-material/Payments"
import PeopleIcon from "@mui/icons-material/People"
import ScheduleIcon from "@mui/icons-material/Schedule"
import StarIcon from "@mui/icons-material/Star"
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Chip,
  Link,
  Stack,
  Typography,
} from "@mui/material"
import SavedItemButton from "@/components/SavedItemButton"

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  CONTRACT: "Hợp đồng",
  INTERNSHIP: "Thực tập",
}

interface JobDetails {
  title: string
  company: string
  logo?: string
  location: string
  minSalary?: number
  maxSalary?: number
  salaryText?: string
  postedTime: string
  jobType?: string
  level?: string
  quantity?: number
  endDate?: string
  isActive?: boolean
  rating?: number
  reviews?: number
}

interface JobDetailHeaderProps {
  jobId: number
  job: JobDetails
  isApplied?: boolean
  onApply: () => void
}

export default function JobDetailHeader({
  jobId,
  job,
  isApplied = false,
  onApply,
}: JobDetailHeaderProps) {
  const isExpired = job.endDate ? new Date(job.endDate).getTime() < Date.now() : false
  const isClosed = job.isActive === false || isExpired

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<ChevronRightIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
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

      {isClosed && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          {job.isActive === false
            ? "Tuyển dụng vị trí này đã tạm dừng."
            : "Thời hạn nhận hồ sơ ứng tuyển công việc này đã kết thúc."}
        </Alert>
      )}

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
          <Stack direction="row" spacing={3} alignItems="flex-start">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.800" : "common.white",
                p: job.logo ? 1 : 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
                borderColor: "divider",
                flexShrink: 0,
              }}
            >
              {job.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={job.logo}
                  alt={job.company}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <BusinessIcon sx={{ color: "grey.400", fontSize: 36 }} />
              )}
            </Box>
            <Box>
              <Typography
                variant="h4"
                fontWeight="800"
                sx={{ letterSpacing: "-0.5px", mb: 1, color: "text.primary" }}
              >
                {job.title}
              </Typography>

              {/* Company & Rating line */}
              <Stack direction="row" spacing={2} alignItems="center" mb={1.5} flexWrap="wrap">
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{ color: "primary.main", fontWeight: 600 }}
                >
                  <BusinessIcon fontSize="small" />
                  <Typography variant="body2" fontWeight="bold">{job.company}</Typography>
                </Box>

                {job.rating !== undefined && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <StarIcon sx={{ color: "#faaf00", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {job.rating.toFixed(1)}
                    </Typography>
                    {job.reviews ? (
                      <Typography variant="caption" color="text.secondary">
                        ({job.reviews} đánh giá)
                      </Typography>
                    ) : null}
                  </Stack>
                )}
              </Stack>

              {/* Job Details Meta info */}
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={{ xs: 1.5, sm: 2.5 }}
                alignItems="center"
              >
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
                    {job.salaryText
                      ? job.salaryText
                      : job.minSalary && job.maxSalary
                      ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                      : "Thỏa thuận"}
                  </Typography>
                </Box>

                {job.quantity && (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    sx={{ color: "text.secondary" }}
                  >
                    <PeopleIcon fontSize="small" />
                    <Typography variant="body2">Tuyển {job.quantity} người</Typography>
                  </Box>
                )}

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

                {job.endDate && (
                  <Chip
                    icon={<EventIcon sx={{ fontSize: "14px !important" }} />}
                    label={
                      isExpired
                        ? "Đã hết hạn"
                        : `Hạn nộp: ${new Date(job.endDate).toLocaleDateString("vi-VN")}`
                    }
                    size="small"
                    color={isExpired ? "error" : "default"}
                    variant={isExpired ? "filled" : "outlined"}
                    sx={{ fontSize: "0.75rem" }}
                  />
                )}

                {job.jobType && (
                  <Chip
                    label={JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
                    size="small"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      bgcolor: "primary.light",
                      color: "primary.main",
                    }}
                  />
                )}

                {job.level && (
                  <Chip
                    label={job.level}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ width: { xs: "100%", md: "auto" }, alignItems: "center" }}
          >
            <Button
              variant="contained"
              color={isApplied ? "success" : isClosed ? "inherit" : "primary"}
              disabled={isApplied || isClosed}
              startIcon={isApplied ? <CheckCircleIcon /> : undefined}
              onClick={onApply}
              sx={{
                flexGrow: { xs: 1, md: 0 },
                whiteSpace: "nowrap",
                px: 3.5,
                py: 1.2,
                minWidth: "fit-content",
                fontWeight: "bold",
                borderRadius: 2.5,
                textTransform: "none",
                boxShadow: "none",
                fontSize: "0.95rem",
                "&.Mui-disabled": {
                  bgcolor: isApplied
                    ? "success.light"
                    : isClosed
                    ? "grey.200"
                    : "action.disabledBackground",
                  color: isApplied
                    ? "success.dark"
                    : isClosed
                    ? "grey.600"
                    : "action.disabled",
                },
                "&:hover": {
                  bgcolor: isApplied
                    ? "success.main"
                    : isClosed
                    ? "grey.300"
                    : "primary.dark",
                  boxShadow: "none",
                },
              }}
            >
              {isApplied
                ? "Đã ứng tuyển"
                : isClosed
                ? "Đã hết hạn tuyển dụng"
                : "Apply Now"}
            </Button>
            <SavedItemButton
              kind="job"
              resourceId={jobId}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 1.5,
                "&:hover": { bgcolor: "action.hover" },
              }}
            />
          </Stack>
        </Box>
      </Card>
    </>
  )
}
