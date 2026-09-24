"use client"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import GroupsIcon from "@mui/icons-material/Groups"
import LanguageIcon from "@mui/icons-material/Language"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import MailIcon from "@mui/icons-material/Mail"
import PaymentsIcon from "@mui/icons-material/Payments"
import ShareIcon from "@mui/icons-material/Share"
import WorkOutlineIcon from "@mui/icons-material/WorkOutline"
import {
  Avatar,
  Box,
  Card,
  Chip,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material"
import NextLink from "next/link"
import { useRouter } from "next/navigation"

interface SimilarJob {
  id: number
  title: string
  company: string
  companyLogo?: string
  location: string
  salary: string
  jobType?: string
  level?: string
}

interface JobDetails {
  companyId?: number
  companySize: string
  website: string
  companyDesc: string
}

interface JobDetailSidebarProps {
  job: JobDetails
  similarJobs: SimilarJob[]
  onCopyLink: () => void
}

export default function JobDetailSidebar({
  job,
  similarJobs,
  onCopyLink,
}: JobDetailSidebarProps) {
  const router = useRouter()

  return (
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
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="text.primary"
          mb={3}
        >
          About the Company
        </Typography>
        <Stack spacing={2.5}>
          {/* Website */}
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            p={2}
            sx={{ bgcolor: "grey.50", borderRadius: 2 }}
          >
            <LanguageIcon sx={{ color: "primary.main" }} />
            <Box display="flex" flexDirection="column" gap={0.5} minWidth={0}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", fontWeight: "bold", display: "block" }}
              >
                Website
              </Typography>
              <Link
                href={
                  job.website && job.website !== "N/A"
                    ? job.website.startsWith("http")
                      ? job.website
                      : `https://${job.website}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  typography: "body2",
                  fontWeight: "bold",
                  color: "primary.main",
                  wordBreak: "break-all",
                }}
              >
                {job.website}
              </Link>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {job.companyDesc}
            </Typography>

            {job.companyId ? (
              <Link
                component={NextLink}
                href={`/companies/${job.companyId}`}
                underline="hover"
                sx={{
                  typography: "body2",
                  fontWeight: "bold",
                  color: "primary.main",
                  display: "inline-flex",
                  alignItems: "center",
                  mt: 1.5,
                  fontSize: "0.875rem",
                  "&:hover": { color: "primary.dark" },
                }}
              >
                Xem chi tiết công ty →
              </Link>
            ) : null}
          </Box>
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
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(0, 114, 229, 0.15)"
                  : "rgba(0, 43, 92, 0.08)",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WorkOutlineIcon fontSize="small" />
          </Box>
          <Box flex={1}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="text.primary"
              lineHeight={1.2}
            >
              Việc làm tương tự
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Có thể bạn quan tâm
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={2}>
          {similarJobs.map((simJob) => (
            <Box
              key={simJob.id}
              onClick={() => router.push(`/jobs/${simJob.id}`)}
              sx={{
                p: 1.75,
                borderRadius: 2.5,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "grey.800"
                      : "common.white",
                  borderColor: "primary.main",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 20px rgba(0,0,0,0.5)"
                      : "0 6px 20px rgba(0, 43, 92, 0.1)",
                  transform: "translateY(-3px)",
                  "& .sim-job-title": {
                    color: "primary.main",
                  },
                  "& .sim-arrow": {
                    transform: "translateX(3px)",
                    color: "primary.main",
                  },
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                {/* Logo or Icon */}
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "common.white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 0.5,
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  {simJob.companyLogo ? (
                    <Box
                      component="img"
                      src={simJob.companyLogo}
                      alt={simJob.companyName || simJob.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <WorkOutlineIcon sx={{ color: "grey.400", fontSize: 20 }} />
                  )}
                </Box>

                {/* Details */}
                <Box flex={1} minWidth={0}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={1}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      className="sim-job-title"
                      sx={{
                        lineHeight: 1.3,
                        transition: "color 0.2s ease",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {simJob.title}
                    </Typography>
                    <ChevronRightIcon
                      className="sim-arrow"
                      sx={{
                        fontSize: 18,
                        color: "text.disabled",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    display="block"
                    sx={{ mt: 0.5, mb: 1, fontWeight: 500 }}
                  >
                    {simJob.company}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    flexWrap="nowrap"
                    sx={{ minWidth: 0, overflow: "hidden" }}
                  >
                    {/* Salary Chip */}
                    <Chip
                      icon={
                        <PaymentsIcon
                          sx={{
                            "&&": {
                              fontSize: 13,
                              color: "success.main",
                            },
                          }}
                        />
                      }
                      label={simJob.salary}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.725rem",
                        fontWeight: 700,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(46, 125, 50, 0.2)"
                            : "#e8f5e9",
                        color: "success.main",
                        border: "1px solid",
                        borderColor: "rgba(46, 125, 50, 0.2)",
                        flexShrink: 0,
                        "& .MuiChip-label": { px: 0.8 },
                      }}
                    />

                    {/* Location Chip */}
                    <Chip
                      icon={
                        <LocationOnIcon
                          sx={{
                            "&&": {
                              fontSize: 13,
                              color: "text.secondary",
                            },
                          }}
                        />
                      }
                      label={simJob.location}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.725rem",
                        fontWeight: 500,
                        bgcolor: "background.paper",
                        color: "text.secondary",
                        border: "1px solid",
                        borderColor: "divider",
                        flexShrink: 1,
                        minWidth: 0,
                        "& .MuiChip-label": {
                          px: 0.8,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
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
          sx={{
            textTransform: "uppercase",
            letterSpacing: 1,
            display: "block",
            mb: 2,
          }}
        >
          Share this job
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <IconButton
            sx={{
              bgcolor: "grey.100",
              color: "text.primary",
              "&:hover": {
                bgcolor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={onCopyLink}
            sx={{
              bgcolor: "grey.100",
              color: "text.primary",
              "&:hover": {
                bgcolor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: "grey.100",
              color: "text.primary",
              "&:hover": {
                bgcolor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          >
            <MailIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Card>
    </Stack>
  )
}
