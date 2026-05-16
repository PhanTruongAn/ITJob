"use client"
import ContactPageIcon from "@mui/icons-material/ContactPage"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CallIcon from "@mui/icons-material/Call"
import MailIcon from "@mui/icons-material/Mail"
import LanguageIcon from "@mui/icons-material/Language"
import FacebookIcon from "@mui/icons-material/Facebook"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import IconButton from "@mui/material/IconButton"

export default function CompanySidebarContact() {
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

      <Stack spacing={2.5}>
        <Box display="flex" gap={2} alignItems="flex-start">
          <LocationOnIcon sx={{ color: "text.secondary", fontSize: 20, mt: 0.2 }} />
          <Typography variant="body2" color="text.secondary" lineHeight={1.5}>
            FPT Tower, 10 Pham Van Bach Street, Cau Giay District, Hanoi
          </Typography>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
          <CallIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            +84 24 3768 9048
          </Typography>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
          <MailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Link
            href="mailto:contact@fpt-software.com"
            underline="hover"
            sx={{
              typography: "body2",
              fontWeight: 500,
              color: "primary.main",
            }}
          >
            contact@fpt-software.com
          </Link>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
          <LanguageIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Link
            href="https://www.fpt-software.com"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              typography: "body2",
              fontWeight: 500,
              color: "primary.main",
            }}
          >
            www.fpt-software.com
          </Link>
        </Box>
      </Stack>

      <Box mt={4}>
        <Typography
          variant="caption"
          fontWeight="bold"
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 2 }}
        >
          Mạng xã hội
        </Typography>
        <Stack direction="row" gap={1.5}>
          <IconButton
            size="small"
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
              color: "primary.main",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
              color: "primary.main",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <FacebookIcon />
          </IconButton>
        </Stack>
      </Box>
    </Paper>
  )
}
