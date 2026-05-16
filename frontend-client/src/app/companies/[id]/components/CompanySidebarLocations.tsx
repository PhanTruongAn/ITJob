"use client"
import MapIcon from "@mui/icons-material/Map"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

const locations = [
  { city: "Hanoi (HQ)", country: "Vietnam" },
  { city: "Ho Chi Minh City", country: "Vietnam" },
  { city: "Tokyo", country: "Japan" },
  { city: "Singapore", country: "Singapore" },
  { city: "Texas", country: "USA" },
]

export default function CompanySidebarLocations() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Stack direction="row" alignItems="center" gap={1} mb={2.5}>
        <MapIcon sx={{ color: "text.primary" }} />
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
          Văn phòng chính
        </Typography>
      </Stack>

      <Box
        sx={{
          height: 192,
          width: "100%",
          borderRadius: 2,
          mb: 2.5,
          overflow: "hidden",
          filter: "grayscale(100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGGLCj1JNEB4pJUquyC76q5kY--n_oAVn4CmEQ50N_-Mb3avQCeYGnXkTQ65j3__I-qpKFbiYC4a_8Jd7ZIxbwFcAHMw8ETQcxSDbaPgkb_8SGRxCAJeDAzjtCkSRylUWKtcO3EKdWzo4SFRTpjZkr-etmMBs9i-k8GnL2uPJcWp2nPLKsvfAe_yNqdH_SzSTbMBen8_Si3kWm5uddSEyWaAIcTNrHu3f5wY1jc8t5wxeqL3tkIcVJ_NP2NdutpbZfooxkpxCpPJ0"
          alt="Office map"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Stack spacing={2}>
        {locations.map((loc, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {loc.city}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {loc.country}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Button
        fullWidth
        variant="outlined"
        sx={{
          mt: 4,
          py: 1,
          borderRadius: 2,
          fontWeight: "bold",
          borderColor: "divider",
          color: "text.primary",
          textTransform: "none",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "action.hover",
          },
        }}
      >
        Xem tất cả 52 địa điểm
      </Button>
    </Paper>
  )
}
