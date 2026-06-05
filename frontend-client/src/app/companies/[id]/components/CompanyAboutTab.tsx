"use client"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Thứ 2",
  TUESDAY: "Thứ 3",
  WEDNESDAY: "Thứ 4",
  THURSDAY: "Thứ 5",
  FRIDAY: "Thứ 6",
  SATURDAY: "Thứ 7",
  SUNDAY: "Chủ nhật",
}

interface CompanyAboutTabProps {
  description?: string
  workingDays?: string[]
  overtime?: boolean
}

export default function CompanyAboutTab({
  description,
  workingDays,
  overtime,
}: CompanyAboutTabProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {/* Overview */}
      <Box component="section">
        <Typography
          variant="h6"
          fontWeight="800"
          sx={{ color: "primary.main", mb: 2, fontSize: "1.15rem" }}
        >
          Tổng quan
        </Typography>
        {description ? (
          <Typography
            variant="body1"
            color="text.secondary"
            lineHeight={1.8}
            sx={{ whiteSpace: "pre-line" }}
          >
            {description}
          </Typography>
        ) : (
          <Typography variant="body1" color="text.disabled" fontStyle="italic">
            Chưa có mô tả công ty.
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Working conditions */}
      {(workingDays && workingDays.length > 0) || overtime !== undefined ? (
        <>
          <Box component="section">
            <Typography
              variant="h6"
              fontWeight="800"
              sx={{ color: "primary.main", mb: 2, fontSize: "1.15rem" }}
            >
              Điều kiện làm việc
            </Typography>

            <Stack spacing={3}>
              {workingDays && workingDays.length > 0 && (
                <Box>
                  <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
                    <EventAvailableIcon
                      sx={{ fontSize: 20, color: "primary.main" }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      Ngày làm việc
                    </Typography>
                  </Stack>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {workingDays.map((day) => (
                      <Chip
                        key={day}
                        label={DAY_LABELS[day] ?? day}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          borderRadius: 999,
                          fontSize: "0.8rem",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {overtime !== undefined && (
                <Stack direction="row" alignItems="center" gap={1.5}>
                  {overtime ? (
                    <WarningAmberIcon
                      sx={{ color: "warning.main", fontSize: 20 }}
                    />
                  ) : (
                    <CheckCircleOutlineIcon
                      sx={{ color: "success.main", fontSize: 20 }}
                    />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {overtime
                      ? "Có thể làm ngoài giờ (OT)"
                      : "Không yêu cầu làm ngoài giờ"}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>
          <Divider />
        </>
      ) : null}

      {/* Culture placeholder */}
      <Box component="section">
        <Typography
          variant="h6"
          fontWeight="800"
          sx={{ color: "primary.main", mb: 1.5, fontSize: "1.15rem" }}
        >
          Văn hóa công ty
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          lineHeight={1.8}
        >
          Thông tin về văn hoá công ty sẽ sớm được cập nhật.
        </Typography>
      </Box>
    </Box>
  )
}
