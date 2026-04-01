"use client"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import DescriptionIcon from "@mui/icons-material/Description"
import EditIcon from "@mui/icons-material/Edit"
import FavoriteIcon from "@mui/icons-material/Favorite"
import LockIcon from "@mui/icons-material/Lock"
import MailIcon from "@mui/icons-material/Mail"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import SendIcon from "@mui/icons-material/Send"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // If user is logged out (unauthenticated), redirect to login page.
    if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])

  // Check if it's a gmail login (or Google provider).
  const isGoogleLogin = session?.user?.email?.endsWith("gmail.com") // Alternatively check provider if it's available

  if (status === "loading") {
    return <Box p={4}>Loading...</Box>
  }

  if (status === "unauthenticated") {
    return null // Will redirect in useEffect
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      {/* Header */}
      <Box mb={5}>
        <Typography
          variant="h4"
          fontWeight={900}
          color="primary.main"
          gutterBottom
        >
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Manage your professional profile, track your job seeking
          activities, and adjust your preferences.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12} lg={isGoogleLogin ? 12 : 8}>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <PersonOutlineIcon color="primary" />
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Profile Information
              </Typography>
            </Box>

            <Box sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 4,
                  alignItems: "flex-start",
                }}
              >
                {/* Avatar */}
                <Box position="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      session?.user?.image ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3hrky3mKUnuYGmzXYGU3tnuEKEqksbJvuRPGDIWt7m6_39vK9QJSV59rIjSavBoCJs9J3srMF1KBYTPdHSTP-Q0XRexd0jO9JRshu4CMXrnlijMQVMfJ_8f1hfQAXYtOtj3i3zV-BJOYAqAlPaunsLMX5KcMevdr82ewHhUhbGBXuS6NCkx8OXW3s4H0K-MOlTS9Xs7-0lQgZ2GDFLeT-eaMY4a9aNyKkWtbJZWFTvO6VF4oO0pdjwGlmmBNLMgpMRchjfbp82D8"
                    }
                    alt="Profile Picture"
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 16,
                      objectFit: "cover",
                      boxShadow: "0 0 0 4px rgba(0, 43, 92, 0.05)",
                    }}
                  />
                  <IconButton
                    color="primary"
                    sx={{
                      position: "absolute",
                      bottom: -8,
                      right: -8,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      boxShadow: 3,
                      "&:hover": { bgcolor: "primary.dark" },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Form Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={isGoogleLogin ? 3 : 6}>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={600}
                      display="block"
                      mb={1}
                    >
                      Full Name
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      defaultValue={session?.user?.name || "Candidate Name"}
                      variant="outlined"
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "background.default"
                            : "grey.50",
                        borderRadius: 1,
                        "& fieldset": { borderColor: "divider" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={isGoogleLogin ? 3 : 6}>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={600}
                      display="block"
                      mb={1}
                    >
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      defaultValue={
                        session?.user?.email || "candidate@terminalslate.com"
                      }
                      variant="outlined"
                      disabled={isGoogleLogin}
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "background.default"
                            : "grey.50",
                        borderRadius: 1,
                        "& fieldset": { borderColor: "divider" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={isGoogleLogin ? 3 : 6}>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={600}
                      display="block"
                      mb={1}
                    >
                      Phone Number
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="tel"
                      defaultValue="+1 (555) 000-1234"
                      variant="outlined"
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "background.default"
                            : "grey.50",
                        borderRadius: 1,
                        "& fieldset": { borderColor: "divider" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={isGoogleLogin ? 3 : 6}>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={600}
                      display="block"
                      mb={1}
                    >
                      Location
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      defaultValue="Ho Chi Minh City, VN"
                      variant="outlined"
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "background.default"
                            : "grey.50",
                        borderRadius: 1,
                        "& fieldset": { borderColor: "divider" },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box
                mt={4}
                pt={3}
                borderTop="1px solid"
                borderColor="divider"
                display="flex"
                justifyContent="flex-end"
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ px: 4, fontWeight: "bold", borderRadius: 2 }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Security Section (Hidden for Google Login) */}
        {!isGoogleLogin && (
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <LockIcon color="primary" />
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  Security
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Box mb={4} display="flex" flexDirection="column" gap={2}>
                  <Box>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={600}
                      display="block"
                      mb={1}
                      sx={{ textTransform: "none", fontSize: "0.75rem" }}
                    >
                      Current Password
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="password"
                      placeholder="••••••••"
                      variant="outlined"
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "background.default"
                            : "grey.50",
                        borderRadius: 1,
                        "& fieldset": { borderColor: "divider" },
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={600}
                      display="block"
                      mb={1}
                      sx={{ textTransform: "none", fontSize: "0.75rem" }}
                    >
                      New Password
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="password"
                      placeholder="Min. 8 characters"
                      variant="outlined"
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "background.default"
                            : "grey.50",
                        borderRadius: 1,
                        "& fieldset": { borderColor: "divider" },
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "info.light",
                      color: "info.dark",
                      fontWeight: "bold",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "info.main",
                        color: "white",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Update Password
                  </Button>
                </Box>

                <Box pt={3} borderTop="1px solid" borderColor="divider">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: "success.light",
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <VerifiedUserIcon color="success" />
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="success.dark"
                      >
                        2FA Enabled
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        color: "success.dark",
                        minWidth: 0,
                        p: 0,
                        "&:hover": {
                          bgcolor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Manage
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        )}

        {/* Attached CV */}
        <Grid item xs={12}>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              p: { xs: 3, md: 4 },
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
              mb={3}
            >
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
                  PhanTruongAn_Fullstack.pdf
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={1}
                >
                  Last uploaded: 27/02/2026
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="primary.main"
                  component="a"
                  href="#"
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
        </Grid>

        {/* Your Activities */}
        <Grid item xs={12}>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              p: { xs: 3, md: 4 },
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="#1976d2" mb={3}>
              Your Activities
            </Typography>

            <Grid container spacing={3}>
              {/* Applied Jobs */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "#cee4fe",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover svg": { transform: "scale(1.1)", opacity: 0.2 },
                  }}
                >
                  <Box position="relative" zIndex={1}>
                    <Typography
                      variant="overline"
                      fontWeight="bold"
                      color="#0a4c9c"
                      display="block"
                      mb={1}
                    >
                      Applied Jobs
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h3" fontWeight={900} color="#0a4c9c">
                        3
                      </Typography>
                      <ChevronRightIcon
                        sx={{ color: "#0a4c9c", opacity: 0.6 }}
                        fontSize="small"
                      />
                    </Box>
                  </Box>
                  <SendIcon
                    sx={{
                      position: "absolute",
                      bottom: -16,
                      right: -16,
                      fontSize: 80,
                      color: "#90c2f6",
                      opacity: 0.4,
                      transform: "rotate(-12deg)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                </Box>
              </Grid>

              {/* Saved Jobs */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "#fab2b2ff",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover svg": { transform: "scale(1.1)", opacity: 0.2 },
                  }}
                >
                  <Box position="relative" zIndex={1}>
                    <Typography
                      variant="overline"
                      fontWeight="bold"
                      color="#460000"
                      display="block"
                      mb={1}
                    >
                      Saved Jobs
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h3" fontWeight={900} color="#460000">
                        0
                      </Typography>
                    </Box>
                  </Box>
                  <FavoriteIcon
                    sx={{
                      position: "absolute",
                      bottom: -16,
                      right: -16,
                      fontSize: 80,
                      color: "#d13535",
                      opacity: 0.4,
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                </Box>
              </Grid>

              {/* Job Invitations */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "#d4f7d4ff",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover svg": { transform: "scale(1.1)", opacity: 0.2 },
                  }}
                >
                  <Box position="relative" zIndex={1}>
                    <Typography
                      variant="overline"
                      fontWeight="bold"
                      color="#08440c"
                      display="block"
                      mb={1}
                    >
                      Job invitations
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h3" fontWeight={900} color="#08440c">
                        0
                      </Typography>
                    </Box>
                  </Box>
                  <MailIcon
                    sx={{
                      position: "absolute",
                      bottom: -16,
                      right: -16,
                      fontSize: 80,
                      color: "#76cc78",
                      opacity: 0.4,
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Danger Zone */}
        <Grid item xs={12}>
          <Box
            sx={{
              border: "2px dashed",
              borderColor: "#fab2b2ff",
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 3,
              bgcolor: "background.paper",
            }}
          >
            <Box display="flex" alignItems="center" gap={3}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#cd2a2a",
                  color: "white",
                  borderRadius: 2,
                  display: "flex",
                }}
              >
                <DeleteForeverIcon />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#4f1010"
                  mb={0.5}
                >
                  Deactivate Account
                </Typography>
                <Typography
                  variant="body2"
                  color="#7e2626"
                  sx={{ maxWidth: 500, fontWeight: 500 }}
                >
                  This will hide your profile from all recruiters and cancel
                  your active applications. You can reactivate within 30 days.
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              sx={{
                color: "#4f1010",
                borderColor: "white",
                bgcolor: "transparent",
                fontWeight: "bold",
                borderWidth: 2,
                whiteSpace: "nowrap",
                "&:hover": {
                  borderWidth: 2,
                  borderColor: "#cd2a2a",
                  color: "#cd2a2a",
                  bgcolor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              Deactivate Profile
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
