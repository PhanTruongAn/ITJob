"use client"
import AppAppBar from "@/components/AppAppBar"
import { SitemarkIcon } from "@/components/CustomIcons"
import AppTheme from "@/shared-theme/AppTheme"
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import axios from "axios"
import * as React from "react"
import { Card } from "./components/Card"
import { Container } from "./components/Container"

export default function SignUp() {
  const [emailError, setEmailError] = React.useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("")
  const [passwordError, setPasswordError] = React.useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("")
  const [nameError, setNameError] = React.useState(false)
  const [nameErrorMessage, setNameErrorMessage] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [registeredEmail, setRegisteredEmail] = React.useState<string | null>(null)

  // Snackbar for errors
  const [openAlert, setOpenAlert] = React.useState(false)
  const [alertMessage, setAlertMessage] = React.useState("")

  const handleCloseAlert = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return
    setOpenAlert(false)
  }

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement
    const password = document.getElementById("password") as HTMLInputElement
    const name = document.getElementById("name") as HTMLInputElement

    let isValid = true

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true)
      setEmailErrorMessage("Vui lòng nhập địa chỉ email hợp lệ.")
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage("")
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage("Mật khẩu phải có ít nhất 6 ký tự.")
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage("")
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true)
      setNameErrorMessage("Họ tên là bắt buộc.")
      isValid = false
    } else {
      setNameError(false)
      setNameErrorMessage("")
    }

    return isValid
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateInputs()) return

    const data = new FormData(event.currentTarget)
    const name = data.get("name") as string
    const email = data.get("email") as string
    const password = data.get("password") as string

    setLoading(true)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
        { name, email, password }
      )
      setRegisteredEmail(email)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại."
      setAlertMessage(msg)
      setOpenAlert(true)
    } finally {
      setLoading(false)
    }
  }

  // --- Step 2: Màn hình "Verify your email" ---
  if (registeredEmail) {
    return (
      <AppTheme>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            textAlign: "center",
            px: 2,
          }}
        >
          <MarkEmailReadIcon sx={{ fontSize: 80, color: "grey.400" }} />
          <Typography variant="h4" fontWeight={700}>
            Verify your email address
          </Typography>
          <Typography color="text.secondary" fontSize={16}>
            {`We've sent a verification email to `}
            <strong>{registeredEmail}</strong>
            {`.`}
            <br />
            {`If you don't see any email, please look at Spam or Junk folder.`}
          </Typography>
        </Box>
      </AppTheme>
    )
  }

  // --- Step 1: Form đăng ký ---
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity="error" variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>
      <Container direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Đăng ký
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Tên đầy đủ</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Nguyễn Văn A"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Mật khẩu</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#ed1b2f",
                "&:hover": { bgcolor: "#c0162a" },
              }}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </Box>
        </Card>
      </Container>
    </AppTheme>
  )
}
