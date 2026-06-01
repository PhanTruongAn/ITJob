"use client"
import EditIcon from "@mui/icons-material/Edit"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"

interface ProfileState {
  name: string
  phone: string
  address?: string
}

interface ProfileInfoFormProps {
  state: ProfileState
  email: string
  avatarUrl: string
  isGoogleLogin: boolean
  isPending: boolean
  onChangeName: (val: string) => void
  onChangePhone: (val: string) => void
  onChangeAddress: (val: string) => void
  onSubmit: () => void
}

export default function ProfileInfoForm({
  state,
  email,
  avatarUrl,
  isGoogleLogin,
  isPending,
  onChangeName,
  onChangePhone,
  onChangeAddress,
  onSubmit,
}: ProfileInfoFormProps) {
  return (
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
              src={avatarUrl}
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
                value={state.name || ""}
                variant="outlined"
                onChange={(e) => onChangeName(e.target.value)}
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
                value={email}
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
                value={state.phone || ""}
                variant="outlined"
                onChange={(e) => onChangePhone(e.target.value)}
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
                value={state.address || ""}
                variant="outlined"
                onChange={(e) => onChangeAddress(e.target.value)}
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
            disabled={isPending}
            sx={{ px: 4, fontWeight: "bold", borderRadius: 2 }}
            onClick={onSubmit}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
