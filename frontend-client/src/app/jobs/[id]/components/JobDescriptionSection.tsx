"use client"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import TerminalIcon from "@mui/icons-material/Terminal"
import {
  Avatar,
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Theme,
  Typography,
} from "@mui/material"
import { ReactNode } from "react"

interface BenefitItem {
  name: string
  icon: ReactNode
}

interface JobDetails {
  description: string
  responsibilities?: string[]
  requirementsTags?: string[]
  requirements?: string[]
  benefits?: BenefitItem[]
}

interface JobDescriptionSectionProps {
  job: JobDetails
}

export default function JobDescriptionSection({
  job,
}: JobDescriptionSectionProps) {
  return (
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
      <Box mb={job.responsibilities?.length || job.requirements?.length ? 4 : 0}>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="text.primary"
          sx={{ mb: 2 }}
        >
          Mô tả công việc
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.8, whitespace: "pre-line" }}
        >
          {job.description || "Chưa có mô tả chi tiết."}
        </Typography>
      </Box>

      {/* Responsibilities */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <Box mb={4}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Box
              sx={{
                width: 4,
                height: 20,
                bgcolor: "primary.main",
                borderRadius: 1,
              }}
            />
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Trách nhiệm công việc
            </Typography>
          </Stack>
          <Stack spacing={1.5}>
            {job.responsibilities.map((resp, i) => (
              <Box key={i} display="flex" alignItems="flex-start" gap={1.5}>
                <CheckCircleIcon
                  sx={{ color: "primary.main", fontSize: 20, mt: 0.3 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {resp}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Requirements */}
      {((job.requirementsTags && job.requirementsTags.length > 0) || (job.requirements && job.requirements.length > 0)) && (
        <Box mb={job.benefits?.length ? 4 : 0}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Box
              sx={{
                width: 4,
                height: 20,
                bgcolor: "primary.main",
                borderRadius: 1,
              }}
            />
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Yêu cầu & Kỹ năng
            </Typography>
          </Stack>

          {job.requirementsTags && job.requirementsTags.length > 0 && (
            <Stack direction="row" gap={1} flexWrap="wrap" mb={3}>
              {job.requirementsTags.filter(Boolean).map((tag, index) => (
                <Chip
                  key={`${tag}-${index}`}
                  label={tag ? tag.toString().toUpperCase() : ""}
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
          )}

          {job.requirements && job.requirements.length > 0 && (
            <Stack spacing={1.5}>
              {job.requirements.map((req, i) => (
                <Box key={i} display="flex" alignItems="flex-start" gap={1.5}>
                  <TerminalIcon
                    sx={{ color: "primary.main", fontSize: 20, mt: 0.3 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {req}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
            <Box
              sx={{
                width: 4,
                height: 20,
                bgcolor: "primary.main",
                borderRadius: 1,
              }}
            />
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Quyền lợi được hưởng
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            {job.benefits.map((benefit, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme: Theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "grey.50",
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
                        theme.palette.mode === "dark"
                          ? "grey.800"
                          : "success.light",
                      color: "success.main",
                      borderRadius: 2,
                    }}
                  >
                    {benefit.icon}
                  </Avatar>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color="text.primary"
                  >
                    {benefit.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Card>
  )
}
