"use client"
import LockIcon from "@mui/icons-material/Lock"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import { Box, Button, TextField, Typography } from "@mui/material"

export default function SecurityForm() {
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
  )
}
