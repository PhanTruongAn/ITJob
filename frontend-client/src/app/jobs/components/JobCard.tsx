"use client"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PaymentsIcon from "@mui/icons-material/Payments"
import ScheduleIcon from "@mui/icons-material/Schedule"
import WorkOutlineIcon from "@mui/icons-material/WorkOutline"
import { Box, Chip, IconButton, Stack, Typography } from "@mui/material"
import { useRouter } from "next/navigation"

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  CONTRACT: "Hợp đồng",
  INTERNSHIP: "Thực tập",
}

const LEVEL_COLORS: Record<string, string> = {
  INTERN: "#e3f2fd",
  FRESHER: "#e8f5e9",
  JUNIOR: "#fff3e0",
  MIDDLE: "#fce4ec",
  SENIOR: "#ede7f6",
}

export interface JobCardProps {
  id?: number | string
  title: string
  company: string
  companyLogo?: string
  salary: string
  location: string
  timeAgo: string
  tags: string[]
  badge?: string
  jobType?: string
  level?: string
}

export default function JobCard({
  id,
  title,
  company,
  companyLogo,
  salary,
  location,
  timeAgo,
  tags,
  badge,
  jobType,
  level,
}: JobCardProps) {
  const router = useRouter()

  return (
    <Box
      sx={{
        p: 3,
        border: 1,
        borderColor: "divider",
        boxShadow: "none",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.3s ease-in-out",
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "grey.900" : "rgb(253, 251, 245)",
        position: "relative",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
          "& .job-title": {
            color: "primary.main",
          },
        },
      }}
    >
      {badge && (
        <Box
          sx={{
            position: "absolute",
            top: -10,
            right: -15,
            px: 1.5,
            py: 0.5,
            bgcolor: "error.light",
            color: "error.main",
            fontSize: 10,
            fontWeight: "bold",
            borderRadius: 1,
          }}
        >
          {badge}
        </Box>
      )}
      <Stack direction="row" spacing={3}>
        <Box
          sx={{
            width: 64,
            height: 64,
            bgcolor: "common.white",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: companyLogo ? 0.5 : 0,
          }}
        >
          {companyLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={companyLogo}
              alt={company}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <WorkOutlineIcon sx={{ color: "grey.400", fontSize: 28 }} />
          )}
        </Box>
        <Box flex={1} minWidth={0}>
          <Typography
            variant="h6"
            fontWeight="bold"
            className="job-title"
            sx={{
              mb: 0.5,
              cursor: "pointer",
              transition: "color 0.2s",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            onClick={() => router.push(`/jobs/${id || 1}`)}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {company}
          </Typography>
          <Stack direction="row" spacing={2} mb={1} flexWrap="wrap">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PaymentsIcon fontSize="small" />
              <Typography variant="body2" color="success.main">
                {salary}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">{location}</Typography>
            </Stack>
            {timeAgo && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ScheduleIcon fontSize="small" />
                <Typography variant="body2">{timeAgo}</Typography>
              </Stack>
            )}
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {jobType && (
              <Chip
                label={JOB_TYPE_LABELS[jobType] ?? jobType}
                size="small"
                sx={{ bgcolor: "primary.light", color: "primary.main", mb: 0.5, fontWeight: 600 }}
              />
            )}
            {level && (
              <Chip
                label={level}
                size="small"
                sx={{
                  bgcolor: LEVEL_COLORS[level] ?? "grey.100",
                  color: "text.primary",
                  mb: 0.5,
                }}
              />
            )}
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ bgcolor: "grey.100", color: "text.primary", mb: 0.5 }}
              />
            ))}
          </Stack>
        </Box>
        <IconButton
          sx={{
            alignSelf: "flex-start",
            "&:hover": { color: "primary.main" },
          }}
        >
          <BookmarkBorderIcon />
        </IconButton>
      </Stack>
    </Box>
  )
}
