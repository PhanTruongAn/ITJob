"use client"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import GroupsIcon from "@mui/icons-material/Groups"
import LanguageIcon from "@mui/icons-material/Language"
import MailIcon from "@mui/icons-material/Mail"
import ShareIcon from "@mui/icons-material/Share"
import {
  Box,
  Card,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material"
import { useRouter } from "next/navigation"

interface SimilarJob {
  id: number
  title: string
  company: string
  location: string
  salary: string
}

interface JobDetails {
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
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            p={2}
            sx={{ bgcolor: "grey.50", borderRadius: 2 }}
          >
            <GroupsIcon sx={{ color: "primary.main" }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", fontWeight: "bold" }}
              >
                Size
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.primary"
              >
                {job.companySize}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            p={2}
            sx={{ bgcolor: "grey.50", borderRadius: 2 }}
          >
            <LanguageIcon sx={{ color: "primary.main" }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", fontWeight: "bold" }}
              >
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
                {job.website}
              </Link>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {job.companyDesc}
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
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="text.primary"
          mb={3}
        >
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
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={1}
              >
                {simJob.company} • {simJob.location}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="success.main"
              >
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
