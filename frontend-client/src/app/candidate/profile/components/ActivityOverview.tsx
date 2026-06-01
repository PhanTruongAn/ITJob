"use client"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import FavoriteIcon from "@mui/icons-material/Favorite"
import MailIcon from "@mui/icons-material/Mail"
import SendIcon from "@mui/icons-material/Send"
import { Box, Grid, Typography } from "@mui/material"

interface ActivityOverviewProps {
  appliedCount?: number
  savedCount?: number
  invitationsCount?: number
}

export default function ActivityOverview({
  appliedCount = 3,
  savedCount = 0,
  invitationsCount = 0,
}: ActivityOverviewProps) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        p: { xs: 3, md: 4 },
      }}
    >
      <Typography variant="h6" fontWeight="bold" color="#1976d2" mb={3}>
        Your Activities
      </Typography>

      <Grid container spacing={3}>
        {/* Applied Jobs */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "#cee4fe",
              position: "relative",
              overflow: "hidden",
              "&:hover svg": { transform: "scale(1.1)", opacity: 0.2 },
            }}
          >
            <Box position="relative" zIndex={1}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="#0a4c9c"
                display="block"
                mb={1}
              >
                Applied Jobs
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h3" fontWeight={900} color="#0a4c9c">
                  {appliedCount}
                </Typography>
                <ChevronRightIcon
                  sx={{ color: "#0a4c9c", opacity: 0.6 }}
                  fontSize="small"
                />
              </Box>
            </Box>
            <SendIcon
              sx={{
                position: "absolute",
                bottom: -16,
                right: -16,
                fontSize: 80,
                color: "#90c2f6",
                opacity: 0.4,
                transform: "rotate(-12deg)",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </Box>
        </Grid>

        {/* Saved Jobs */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "#fab2b2ff",
              position: "relative",
              overflow: "hidden",
              "&:hover svg": { transform: "scale(1.1)", opacity: 0.2 },
            }}
          >
            <Box position="relative" zIndex={1}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="#460000"
                display="block"
                mb={1}
              >
                Saved Jobs
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h3" fontWeight={900} color="#460000">
                  {savedCount}
                </Typography>
              </Box>
            </Box>
            <FavoriteIcon
              sx={{
                position: "absolute",
                bottom: -16,
                right: -16,
                fontSize: 80,
                color: "#d13535",
                opacity: 0.4,
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </Box>
        </Grid>

        {/* Job Invitations */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "#d4f7d4ff",
              position: "relative",
              overflow: "hidden",
              "&:hover svg": { transform: "scale(1.1)", opacity: 0.2 },
            }}
          >
            <Box position="relative" zIndex={1}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="#08440c"
                display="block"
                mb={1}
              >
                Job invitations
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h3" fontWeight={900} color="#08440c">
                  {invitationsCount}
                </Typography>
              </Box>
            </Box>
            <MailIcon
              sx={{
                position: "absolute",
                bottom: -16,
                right: -16,
                fontSize: 80,
                color: "#76cc78",
                opacity: 0.4,
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
