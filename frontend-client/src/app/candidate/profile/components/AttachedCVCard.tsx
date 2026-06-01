"use client"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import DescriptionIcon from "@mui/icons-material/Description"
import { Box, Typography } from "@mui/material"
import Link from "next/link"

interface AttachedCVCardProps {
  fileName?: string
  uploadedAt?: string
}

export default function AttachedCVCard({
  fileName = "PhanTruongAn_Fullstack.pdf",
  uploadedAt = "27/02/2026",
}: AttachedCVCardProps) {
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
      <Typography variant="h6" fontWeight="bold" color="primary.main" mb={3}>
        Your Attached CV
      </Typography>
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.900" : "grey.50",
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 56,
            bgcolor: "error.light",
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            flexShrink: 0,
          }}
        >
          <DescriptionIcon fontSize="medium" />
        </Box>
        <Box flexGrow={1} minWidth={0}>
          <Typography
            variant="body2"
            fontWeight="bold"
            color="primary.main"
            noWrap
            component="a"
            href="#"
            sx={{
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
              display: "block",
              mb: 0.5,
            }}
          >
            {fileName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={1}
          >
            Last uploaded: {uploadedAt}
          </Typography>
          <Typography
            variant="caption"
            fontWeight="bold"
            color="primary.main"
            component={Link}
            href="/candidate/cv-attachment"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Manage CV attachment <ChevronRightIcon fontSize="small" />
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
