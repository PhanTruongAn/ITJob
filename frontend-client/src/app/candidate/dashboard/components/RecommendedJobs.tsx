"use client"
import LaunchIcon from "@mui/icons-material/Launch"
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import Link from "next/link"

export interface RecommendedJob {
  id: number
  jobTitle: string
  company: string
  logo: string
  location: string
  salary: string
  tags: string[]
}

interface RecommendedJobsProps {
  jobs: RecommendedJob[]
}

export default function RecommendedJobs({ jobs }: RecommendedJobsProps) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2}>
        Jobs you may like
      </Typography>

      <Stack spacing={2.5}>
        {jobs.map((job) => (
          <Box key={job.id}>
            <Box display="flex" gap={2} alignItems="flex-start" mb={1.5}>
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
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
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
                      t.palette.mode === "dark" ? "grey.800" : "grey.100",
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
  )
}
