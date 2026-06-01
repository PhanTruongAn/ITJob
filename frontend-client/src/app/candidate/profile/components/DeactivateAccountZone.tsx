"use client"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { Box, Button, Typography } from "@mui/material"

export default function DeactivateAccountZone() {
  return (
    <Box
      sx={{
        border: "2px dashed",
        borderColor: "#fab2b2ff",
        borderRadius: 3,
        p: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        bgcolor: "background.paper",
      }}
    >
      <Box display="flex" alignItems="center" gap={3}>
        <Box
          sx={{
            p: 1.5,
            bgcolor: "#cd2a2a",
            color: "white",
            borderRadius: 2,
            display: "flex",
          }}
        >
          <DeleteForeverIcon />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#4f1010" mb={0.5}>
            Deactivate Account
          </Typography>
          <Typography
            variant="body2"
            color="#7e2626"
            sx={{ maxWidth: 500, fontWeight: 500 }}
          >
            This will hide your profile from all recruiters and cancel your
            active applications. You can reactivate within 30 days.
          </Typography>
        </Box>
      </Box>
      <Button
        variant="outlined"
        sx={{
          color: "#4f1010",
          borderColor: "white",
          bgcolor: "transparent",
          fontWeight: "bold",
          borderWidth: 2,
          whiteSpace: "nowrap",
          "&:hover": {
            borderWidth: 2,
            borderColor: "#cd2a2a",
            color: "#cd2a2a",
            bgcolor: "rgba(255,255,255,0.2)",
          },
        }}
      >
        Deactivate Profile
      </Button>
    </Box>
  )
}
