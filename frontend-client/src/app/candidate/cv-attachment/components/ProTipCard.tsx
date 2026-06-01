"use client"
import LightbulbIcon from "@mui/icons-material/Lightbulb"
import { Box, Paper, Typography } from "@mui/material"

export default function ProTipCard() {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "primary.main",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blob */}
      <Box
        sx={{
          position: "absolute",
          bottom: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.08)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <LightbulbIcon sx={{ fontSize: 32, color: "#bbf7d0", mb: 1.5 }} />
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Pro Tip
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Candidates with tailored CVs for specific roles have a{" "}
          <Box component="span" sx={{ color: "#bbf7d0", fontWeight: 700 }}>
            45% higher
          </Box>{" "}
          chance of getting an interview.
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            pb: 0.3,
            cursor: "pointer",
            "&:hover": { borderBottomColor: "white" },
          }}
        >
          Read more tips
        </Typography>
      </Box>
    </Paper>
  )
}
