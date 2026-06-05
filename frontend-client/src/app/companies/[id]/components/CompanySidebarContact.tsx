"use client"
import ContactPageIcon from "@mui/icons-material/ContactPage"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CallIcon from "@mui/icons-material/Call"
import MailIcon from "@mui/icons-material/Mail"
import LanguageIcon from "@mui/icons-material/Language"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"

interface CompanySidebarContactProps {
  address?: string
  phone?: string
  email?: string
  website?: string
}

export default function CompanySidebarContact({
  address,
  phone,
  email,
  website,
}: CompanySidebarContactProps) {
  const hasAnyContact = address || phone || email || website

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" alignItems="center" gap={1} mb={3}>
        <ContactPageIcon sx={{ color: "text.primary" }} />
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
          Thông tin liên hệ
        </Typography>
      </Stack>

      {!hasAnyContact ? (
        <Typography variant="body2" color="text.disabled" fontStyle="italic">
          Chưa có thông tin liên hệ.
        </Typography>
      ) : (
        <Stack spacing={2.5}>
          {address && (
            <Box display="flex" gap={2} alignItems="flex-start">
              <LocationOnIcon
                sx={{ color: "text.secondary", fontSize: 20, mt: 0.2 }}
              />
              <Typography variant="body2" color="text.secondary" lineHeight={1.5}>
                {address}
              </Typography>
            </Box>
          )}

          {phone && (
            <Box display="flex" gap={2} alignItems="center">
              <CallIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                {phone}
              </Typography>
            </Box>
          )}

          {email && (
            <Box display="flex" gap={2} alignItems="center">
              <MailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              <Link
                href={`mailto:${email}`}
                underline="hover"
                sx={{
                  typography: "body2",
                  fontWeight: 500,
                  color: "primary.main",
                }}
              >
                {email}
              </Link>
            </Box>
          )}

          {website && (
            <Box display="flex" gap={2} alignItems="center">
              <LanguageIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              <Link
                href={website.startsWith("http") ? website : `https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  typography: "body2",
                  fontWeight: 500,
                  color: "primary.main",
                  wordBreak: "break-all",
                }}
              >
                {website.replace(/^https?:\/\//, "")}
              </Link>
            </Box>
          )}
        </Stack>
      )}
    </Paper>
  )
}
