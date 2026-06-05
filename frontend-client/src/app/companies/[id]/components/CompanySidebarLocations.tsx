"use client"
import MapIcon from "@mui/icons-material/Map"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

interface CompanySidebarLocationsProps {
  address?: string
  countryName?: string
}

export default function CompanySidebarLocations({
  address,
  countryName,
}: CompanySidebarLocationsProps) {
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
          Địa điểm
        </Typography>
      </Stack>

      {address || countryName ? (
        <Stack spacing={2}>
          {address && (
            <Box display="flex" gap={2} alignItems="flex-start">
              <LocationOnIcon
                sx={{ color: "primary.main", fontSize: 20, mt: 0.2, flexShrink: 0 }}
              />
              <Stack>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {address}
                </Typography>
                {countryName && (
                  <Typography variant="caption" color="text.secondary">
                    {countryName}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}
          {!address && countryName && (
            <Box display="flex" gap={2} alignItems="center">
              <LocationOnIcon
                sx={{ color: "primary.main", fontSize: 20, flexShrink: 0 }}
              />
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {countryName}
              </Typography>
            </Box>
          )}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.disabled" fontStyle="italic">
          Chưa có thông tin địa điểm.
        </Typography>
      )}
    </Paper>
  )
}
