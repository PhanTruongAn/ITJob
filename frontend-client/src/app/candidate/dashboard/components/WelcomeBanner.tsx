"use client"
import SearchIcon from "@mui/icons-material/Search"
import { Box, Button, Grid, Stack, Typography } from "@mui/material"
import Link from "next/link"

interface WelcomeBannerProps {
  userName?: string | null
}

export default function WelcomeBanner({ userName }: WelcomeBannerProps) {
  return (
    <Box
      sx={{
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1e1e2d 0%, #111118 100%)"
            : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        color: "white",
        borderRadius: 4,
        p: { xs: 3, md: 5 },
        mb: 4,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      }}
    >
      {/* Abstract design elements */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "rgba(229, 57, 53, 0.15)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          left: "50%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(25, 118, 210, 0.15)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography
            variant="body2"
            sx={{ opacity: 0.8, fontWeight: 600, mb: 1, letterSpacing: 0.5 }}
          >
            CANDIDATE DASHBOARD
          </Typography>
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              mb: 1.5,
              background: "linear-gradient(90deg, #ffffff 0%, #ffebee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            👋🏻 Welcome back, {userName || "Phan Trường An"}!
          </Typography>
          <Typography
            variant="body1"
            sx={{ opacity: 0.8, maxWidth: 600, mb: 3 }}
          >
            Here&apos;s an overview of your job search progress. Update your
            profile info and review application updates below.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              href="/jobs"
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{
                fontWeight: "bold",
                px: 3,
                py: 1,
                borderRadius: 2,
              }}
            >
              Find Jobs
            </Button>
            <Button
              component={Link}
              href="/candidate/itviec-profile"
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                fontWeight: "bold",
                px: 3,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Update Profile
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
