"use client"
import CheckIcon from "@mui/icons-material/Check"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import { Box, Paper, Stack, Typography } from "@mui/material"

export interface ActivityItem {
  id: number
  label: string
  time: string
  type: "view" | "upload" | "download"
}

interface RecentActivityTimelineProps {
  activities: ActivityItem[]
}

function ActivityDot({ type }: { type: ActivityItem["type"] }) {
  const config = {
    view: {
      bgcolor: "success.main",
      icon: <CheckIcon sx={{ fontSize: 10, color: "white" }} />,
    },
    upload: {
      bgcolor: "primary.main",
      icon: <FileUploadIcon sx={{ fontSize: 10, color: "white" }} />,
    },
    download: {
      bgcolor: "grey.300",
      icon: <FileDownloadIcon sx={{ fontSize: 10, color: "text.secondary" }} />,
    },
  }
  const { bgcolor, icon } = config[type]
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        bgcolor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        mt: 0.3,
      }}
    >
      {icon}
    </Box>
  )
}

export default function RecentActivityTimeline({
  activities,
}: RecentActivityTimelineProps) {
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
        sx={{ mb: 2.5 }}
      >
        Recent Activity
      </Typography>
      <Stack spacing={2.5}>
        {activities.map((item, idx) => (
          <Box key={item.id} sx={{ position: "relative" }}>
            {/* Connector line (not for last item) */}
            {idx < activities.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  left: 9,
                  top: 22,
                  width: 2,
                  height: 28,
                  bgcolor: "divider",
                }}
              />
            )}
            <Box display="flex" gap={1.5}>
              <ActivityDot type={item.type} />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {item.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.time}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  )
}
