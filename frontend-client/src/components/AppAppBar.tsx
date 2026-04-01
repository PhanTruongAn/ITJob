"use client"
import ColorModeIconDropdown from "@/shared-theme/ColorModeIconDropdown"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import MenuIcon from "@mui/icons-material/Menu"
import DashboardIcon from "@mui/icons-material/Dashboard"
import DescriptionIcon from "@mui/icons-material/Description"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import WorkIcon from "@mui/icons-material/Work"
import MailIcon from "@mui/icons-material/Mail"
import SubscriptionsIcon from "@mui/icons-material/Subscriptions"
import NotificationsIcon from "@mui/icons-material/Notifications"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const router = useRouter()
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }
  const mainMenu = [
    { label: "Công việc", href: "/jobs" },
    { label: "Công ty", href: "/companies" },
  ]
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
              {mainMenu.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  variant="text"
                  color="info"
                >
                  {item.label}
                </Button>
              ))}
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
                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <Avatar
                    src={session.user?.image || undefined}
                    sx={{ width: 32, height: 32 }}
                  >
                    {session.user?.name?.[0]}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  onClick={() => setAnchorEl(null)}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                      mt: 1.5,
                      minWidth: 220,
                      borderRadius: 2,
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {session.user?.name || "Candidate Name"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {session.user?.email || "candidate@example.com"}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem component={Link} href="/candidate/dashboard">
                    <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                    Dashboard
                  </MenuItem>
                  <MenuItem component={Link} href="/candidate/cv-attachment">
                    <ListItemIcon><DescriptionIcon fontSize="small" /></ListItemIcon>
                    CV Attachment
                  </MenuItem>
                  <MenuItem component={Link} href="/candidate/itviec-profile">
                    <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                    ITviec Profile
                  </MenuItem>
                  <MenuItem component={Link} href="/candidate/my-jobs">
                     <ListItemIcon><WorkIcon fontSize="small" /></ListItemIcon>
                     My Jobs
                  </MenuItem>
                  <MenuItem component={Link} href="/candidate/job-invitations">
                    <ListItemIcon><MailIcon fontSize="small" /></ListItemIcon>
                    Job Invitation
                  </MenuItem>
                  <MenuItem component={Link} href="/candidate/email-subscriptions">
                    <ListItemIcon><SubscriptionsIcon fontSize="small" /></ListItemIcon>
                    Email Subscriptions
                  </MenuItem>
                  <MenuItem component={Link} href="/candidate/notifications">
                    <ListItemIcon><NotificationsIcon fontSize="small" /></ListItemIcon>
                    Notifications
                  </MenuItem>
                  <MenuItem component={Link} href="/candidate/settings">
                    <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                    Settings
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={() => signOut()} sx={{ color: 'error.main' }}>
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Sign Out
                  </MenuItem>
                </Menu>
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

                {mainMenu.map((item) => (
                  <MenuItem key={item.href}>
                    <Button
                      component={Link}
                      href={item.href}
                      variant="outlined"
                      fullWidth
                    >
                      {item.label}
                    </Button>
                  </MenuItem>
                ))}

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
