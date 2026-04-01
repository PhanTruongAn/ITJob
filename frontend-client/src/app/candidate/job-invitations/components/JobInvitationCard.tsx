"use client"
import CorporateFareIcon from "@mui/icons-material/CorporateFare"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material"

interface JobInvitationCardProps {
  id: number
  role: string
  company: string
  location: string
  logo: string
  receivedAt: string
  message: string
  tags: string[]
  isNew?: boolean
}

export default function JobInvitationCard({
  role,
  company,
  location,
  logo,
  receivedAt,
  message,
  tags,
  isNew,
}: JobInvitationCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: "none",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", md: "start" }}
        >
          {/* Logo container */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "grey.800" : "grey.50",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
              p: 0.5,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt={`${company} logo`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1, width: "100%" }}>
            {/* Header info */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "flex-start" }}
              gap={2}
              mb={2}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  {role}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    color="text.secondary"
                  >
                    <CorporateFareIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={500}>
                      {company}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      bgcolor: "text.disabled",
                    }}
                  />
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    color="text.secondary"
                  >
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={500}>
                      {location}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                alignItems={{ xs: "flex-start", md: "flex-end" }}
                gap={1}
              >
                {isNew && (
                  <Chip
                    label="NEW INVITATION"
                    size="small"
                    sx={{
                      bgcolor: "error.light",
                      color: "error.dark",
                      fontWeight: "bold",
                      fontSize: "0.65rem",
                      height: 24,
                      borderRadius: 1,
                    }}
                  />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={500}
                >
                  {receivedAt}
                </Typography>
              </Box>
            </Box>

            {/* Message Block */}
            <Box
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                p: 2,
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ lineHeight: 1.6 }}
              >
                "{message}"
              </Typography>
            </Box>

            {/* Footer with Tags and Action Buttons */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              gap={3}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: "background.default",
                      color: "text.secondary",
                      fontWeight: 600,
                      borderRadius: "16px",
                      mb: { xs: 1, md: 0 },
                    }}
                  />
                ))}
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                width={{ xs: "100%", md: "auto" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    px: 4,
                    fontWeight: "bold",
                    borderRadius: 2,
                    fontSize: "12px",
                  }}
                >
                  Accept Invitation
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    px: 4,
                    fontWeight: "bold",
                    borderRadius: 2,
                    fontSize: "12px",
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                    color: "text.secondary",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "grey.700" : "grey.200",
                      boxShadow: "none",
                    },
                  }}
                  fullWidth
                >
                  Decline
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
