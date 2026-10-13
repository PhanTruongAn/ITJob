"use client"
import { Alert, Box, Typography } from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function JobInvitationsPage() {
  const { status } = useSession()
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <Box p={4}>{t("common.loading")}</Box>
  }

  if (status === "unauthenticated") {
    return null
  }
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Box mb={5}>
        <Typography variant="h4" fontWeight={900} gutterBottom>
          {t("jobInvitations.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
          {t("jobInvitations.description")}
        </Typography>
      </Box>
      <Alert severity="info">{t("jobInvitations.notAvailable")}</Alert>
    </Box>
  )
}
