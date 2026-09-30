"use client"

import { Box, Button, Paper, Typography } from "@mui/material"
import Link from "next/link"
import { useTranslation } from "react-i18next"

export default function RecommendedJobs() {
  const { t } = useTranslation()

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2}>
        {t("dashboard.recommendedJobs")}
      </Typography>
      <Box textAlign="center" py={2}>
        <Typography variant="body2" color="text.secondary">
          {t("dashboard.recommendationsUnavailable")}
        </Typography>
      </Box>
      <Button
        component={Link}
        href="/jobs"
        fullWidth
        variant="outlined"
        sx={{ mt: 1, fontWeight: "bold", borderRadius: 2 }}
      >
        {t("dashboard.browseJobs")}
      </Button>
    </Paper>
  )
}
