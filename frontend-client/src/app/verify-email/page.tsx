"use client"

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import axios from "axios"

type VerifyStatus = "loading" | "success" | "error"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<VerifyStatus>("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Token xác nhận không hợp lệ.")
      return
    }

    const verify = async () => {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify-email`,
          { params: { token } }
        )
        setStatus("success")
        setMessage("Tài khoản của bạn đã được kích hoạt thành công!")
      } catch (err: any) {
        setStatus("error")
        const errMsg =
          err?.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn."
        setMessage(errMsg)
      }
    }

    verify()
  }, [token])

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          textAlign: "center",
        }}
      >
        {status === "loading" && (
          <>
            <CircularProgress size={64} color="error" />
            <Typography variant="h5" fontWeight={600}>
              Đang xác nhận email...
            </Typography>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircleIcon sx={{ fontSize: 80, color: "success.main" }} />
            <Typography variant="h4" fontWeight={700}>
              Xác nhận thành công!
            </Typography>
            <Typography color="text.secondary" fontSize={16}>
              {message}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/signin")}
              sx={{
                mt: 2,
                bgcolor: "#ed1b2f",
                "&:hover": { bgcolor: "#c0162a" },
                borderRadius: 2,
                px: 4,
              }}
            >
              Đăng nhập ngay
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />
            <Typography variant="h4" fontWeight={700}>
              Xác nhận thất bại
            </Typography>
            <Typography color="text.secondary" fontSize={16}>
              {message}
            </Typography>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push("/")}
              sx={{ mt: 2, borderRadius: 2, px: 4 }}
            >
              Về trang chủ
            </Button>
          </>
        )}
      </Box>
    </Container>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
