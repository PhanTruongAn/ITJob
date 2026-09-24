"use client"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import CategoryIcon from "@mui/icons-material/Category"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import GroupsIcon from "@mui/icons-material/Groups"
import LocationOnIcon from "@mui/icons-material/LocationOn"
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

const DAY_LABELS: Record<string, string> = {
  MONDAY: "T2",
  TUESDAY: "T3",
  WEDNESDAY: "T4",
  THURSDAY: "T5",
  FRIDAY: "T6",
  SATURDAY: "T7",
  SUNDAY: "CN",
}

function formatWorkingDays(days?: string[]): string {
  if (!days || days.length === 0) return "Thứ 2 - Thứ 6"
  if (days.includes("MONDAY") && days.includes("FRIDAY") && days.length === 5) {
    return "Thứ 2 - Thứ 6"
  }
  if (days.includes("MONDAY") && days.includes("SATURDAY") && days.length === 6) {
    return "Thứ 2 - Thứ 7"
  }
  return days.map((d) => DAY_LABELS[d] ?? d).join(", ")
}

interface BenefitItem {
  name: string
  icon: ReactNode
}

export interface CompanyInfo {
  industry?: string
  companySize?: string
  workingDays?: string[]
  overtime?: boolean
  address?: string
}

interface JobDetails {
  description: string
  responsibilities?: string[]
  requirementsTags?: string[]
  requirements?: string[]
  benefits?: BenefitItem[]
  companyInfo?: CompanyInfo
}

interface JobDescriptionSectionProps {
  job: JobDetails
}

export default function JobDescriptionSection({
  job,
}: JobDescriptionSectionProps) {
  const info = job.companyInfo

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
      <Box mb={4}>
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
          sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}
        >
          {job.description || "Chưa có mô tả chi tiết."}
        </Typography>
      </Box>

      {/* Work Environment & Company Info */}
      <Box mb={4}>
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
            Thông tin môi trường làm việc
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              p={2}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CategoryIcon sx={{ color: "primary.main" }} />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                >
                  Lĩnh vực
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.primary"
                >
                  {info?.industry || "Software Development Outsourcing"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              p={2}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <GroupsIcon sx={{ color: "primary.main" }} />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                >
                  Quy mô
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.primary"
                >
                  {info?.companySize || "100 - 500 nhân viên"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              p={2}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CalendarMonthIcon sx={{ color: "primary.main" }} />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                >
                  Thời gian làm việc
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.primary"
                >
                  {formatWorkingDays(info?.workingDays)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              p={2}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <AccessTimeIcon sx={{ color: "primary.main" }} />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                >
                  Chế độ OT
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.primary"
                >
                  {info?.overtime ? "Có OT" : "Không OT"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {info?.address && (
            <Grid item xs={12}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                p={2}
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <LocationOnIcon sx={{ color: "primary.main" }} />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                  >
                    Địa điểm làm việc
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    {info.address}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
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
