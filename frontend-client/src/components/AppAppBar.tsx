"use client"
import ColorModeIconDropdown from "@/shared-theme/ColorModeIconDropdown"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import MenuItem from "@mui/material/MenuItem"
import { alpha, styled } from "@mui/material/styles"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import Sitemark from "./SitemarkIcon"
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: "8px 12px",
}))

export default function AppAppBar() {
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 15px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Sitemark />

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button variant="text" color="info" size="medium">
                Công việc
              </Button>
              <Button variant="text" color="info" size="medium">
                Công ty
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Button color="primary" variant="text" size="medium">
              Nhà tuyển dụng
            </Button>
            {!session ? (
              <>
                <Button color="primary" variant="text" size="medium">
                  <Link href="/signin">Đăng nhập</Link>
                </Button>
                <Button color="primary" variant="contained" size="medium">
                  <Link href="/signup">Đăng ký</Link>
                </Button>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={session.user?.image || undefined}
                    sx={{ width: 32, height: 32 }}
                  >
                    {session.user?.name?.[0]}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.primary", fontWeight: 500 }}
                  >
                    {session.user?.name}
                  </Typography>
                </Box>
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => signOut()}
                >
                  Đăng xuất
                </Button>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem>Công việc</MenuItem>
                <MenuItem>Công ty</MenuItem>

                <Divider sx={{ my: 3 }} />
                {!session ? (
                  <>
                    <MenuItem>
                      <Button color="primary" variant="contained" fullWidth>
                        <Link href="/signup">Đăng ký</Link>
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button color="primary" variant="outlined" fullWidth>
                        <Link href="/signin">Đăng nhập</Link>
                      </Button>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem sx={{ justifyContent: "center", gap: 1 }}>
                      <Avatar
                        src={session.user?.image || undefined}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography variant="body2">
                        {session.user?.name}
                      </Typography>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        color="error"
                        variant="outlined"
                        fullWidth
                        onClick={() => signOut()}
                      >
                        Đăng xuất
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  )
}
