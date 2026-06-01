"use client"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { Box, LinearProgress, Paper, Typography } from "@mui/material"

interface StorageStatusProps {
  usedSlots: number
  totalSlots?: number
}

export default function StorageStatus({
  usedSlots,
  totalSlots = 5,
}: StorageStatusProps) {
  const usedPercent = (usedSlots / totalSlots) * 100

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={700}
        color="primary.main"
        gutterBottom
      >
        Storage Status
      </Typography>
      <Box>
        <Box display="flex" justifyContent="space-between" mb={0.8}>
          <Typography variant="caption" color="text.secondary">
            Used Capacity
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            {usedSlots} / {totalSlots} Files
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={usedPercent}
          sx={{
            height: 8,
            borderRadius: 999,
            bgcolor: "grey.100",
            "& .MuiLinearProgress-bar": { borderRadius: 999 },
            mb: 2,
          }}
        />
        <Box
          display="flex"
          alignItems="flex-start"
          gap={1}
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: (t) =>
              t.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "grey.50",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <InfoOutlinedIcon
            sx={{
              fontSize: 16,
              color: "primary.main",
              mt: 0.2,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            lineHeight={1.6}
          >
            You can store up to {totalSlots} CVs. Delete older versions to make
            space for new ones.
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}
