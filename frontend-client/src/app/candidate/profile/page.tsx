"use client"
import { useUpdateProfile } from "@/apis/profile/profile.hooks"
import { Alert, Box, Grid, Snackbar, Typography } from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useProfileState } from "../commons/hooks"
import ActivityOverview from "./components/ActivityOverview"
import AttachedCVCard from "./components/AttachedCVCard"
import DeactivateAccountZone from "./components/DeactivateAccountZone"
import ProfileInfoForm from "./components/ProfileInfoForm"
import SecurityForm from "./components/SecurityForm"

export default function ITviecProfilePage() {
  const { mutate: updateProfileMutate, isPending: isUpdateProfile } =
    useUpdateProfile()
  const { data: session, status } = useSession()
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const { state, updateState } = useProfileState()
  const router = useRouter()

  useEffect(() => {
    // If user is logged out (unauthenticated), redirect to login page.
    if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      updateState({
        name: session.user.name || "",
        phone: session.user.phone || "",
        address: session.user.address || "",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user])

  // Check if it's a gmail login (or Google provider).
  const isGoogleLogin = !!session?.user?.email?.endsWith("gmail.com")

  if (status === "loading") {
    return <Box p={4}>Loading...</Box>
  }

  if (status === "unauthenticated") {
    return null // Will redirect in useEffect
  }

  const handleUpdateProfile = () => {
    updateProfileMutate(
      {
        name: state.name,
        phone: state.phone,
        address: state.address,
      },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: "Cập nhật thành công",
            severity: "success",
          })
        },
        onError: () => {
          setSnackbar({
            open: true,
            message: "Cập nhật thất bại",
            severity: "error",
          })
        },
      },
    )
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity as any}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box mb={5}>
        <Typography
          variant="h4"
          fontWeight={900}
          color="primary.main"
          gutterBottom
        >
          ITviec Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your professional profile, personal information, and security
          settings.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12} lg={isGoogleLogin ? 12 : 8}>
          <ProfileInfoForm
            state={state}
            email={session?.user?.email || "candidate@terminalslate.com"}
            avatarUrl={
              session?.user?.image ||
              "https://lh3.googleusercontent.com/aida-public/AB6AXuD3hrky3mKUnuYGmzXYGU3tnuEKEqksbJvuRPGDIWt7m6_39vK9QJSV59rIjSavBoCJs9J3srMF1KBYTPdHSTP-Q0XRexd0jO9JRshu4CMXrnlijMQVMfJ_8f1hfQAXYtOtj3i3zV-BJOYAqAlPaunsLMX5KcMevdr82ewHhUhbGBXuS6NCkx8OXW3s4H0K-MOlTS9Xs7-0lQgZ2GDFLeT-eaMY4a9aNyKkWtbJZWFTvO6VF4oO0pdjwGlmmBNLMgpMRchjfbp82D8"
            }
            isGoogleLogin={isGoogleLogin}
            isPending={isUpdateProfile}
            onChangeName={(val) => updateState({ name: val })}
            onChangePhone={(val) => updateState({ phone: val })}
            onChangeAddress={(val) => updateState({ address: val })}
            onSubmit={handleUpdateProfile}
          />
        </Grid>

        {/* Security Section (Hidden for Google Login) */}
        {!isGoogleLogin && (
          <Grid item xs={12} lg={4}>
            <SecurityForm />
          </Grid>
        )}

        {/* Attached CV */}
        <Grid item xs={12}>
          <AttachedCVCard />
        </Grid>

        {/* Your Activities */}
        <Grid item xs={12}>
          <ActivityOverview
            appliedCount={3}
            savedCount={0}
            invitationsCount={0}
          />
        </Grid>

        {/* Danger Zone */}
        <Grid item xs={12}>
          <DeactivateAccountZone />
        </Grid>
      </Grid>
    </Box>
  )
}
