"use client"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PaymentsIcon from "@mui/icons-material/Payments"
import ScheduleIcon from "@mui/icons-material/Schedule"
import { Box, Button, Chip, Stack, Typography } from "@mui/material"

export interface JobCardProps {
  title: string
  company: string
  salary: string
  location: string
  timeAgo: string
  tags: string[]
  badge?: string
}

export default function JobCard({
  title,
  company,
  salary,
  location,
  timeAgo,
  tags,
  badge,
}: JobCardProps) {
  return (
    <Box
      sx={{
        p: 3,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "grey.900" : "common.white",
        position: "relative",
        "&:hover": { boxShadow: 3 },
      }}
    >
      {badge && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
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
            bgcolor: "grey.100",
            borderRadius: 1,
            overflow: "hidden",
            flexShrink: 0,
          }}
        />
        <Box flex={1}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {company}
          </Typography>
          <Stack direction="row" spacing={2} mb={1}>
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
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ScheduleIcon fontSize="small" />
              <Typography variant="body2">{timeAgo}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
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
        <Button variant="text" sx={{ alignSelf: "flex-start" }}>
          <BookmarkBorderIcon />
        </Button>
      </Stack>
    </Box>
  )
}
