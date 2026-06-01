"use client"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import DescriptionIcon from "@mui/icons-material/Description"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import WorkIcon from "@mui/icons-material/Work"
import { Avatar, Box, Card, CardActionArea, Paper, Stack, Typography } from "@mui/material"
import Link from "next/link"

export default function QuickActions() {
  const actions = [
    {
      title: "Update ITviec Profile",
      desc: "Edit details, location, phone & settings.",
      href: "/candidate/itviec-profile",
      icon: <PersonOutlineIcon />,
      avatarBg: "primary.light",
      avatarColor: "primary.main",
      hoverBorderColor: "primary.main",
    },
    {
      title: "Manage CV Attachments",
      desc: "Upload or update your CV files.",
      href: "/candidate/cv-attachment",
      icon: <DescriptionIcon />,
      avatarBg: "#fee2e2",
      avatarColor: "error.main",
      hoverBorderColor: "error.main",
    },
    {
      title: "Track Application Status",
      desc: "Check updates on your applied jobs.",
      href: "/candidate/my-jobs",
      icon: <WorkIcon />,
      avatarBg: "#dcfce7",
      avatarColor: "success.main",
      hoverBorderColor: "success.main",
    },
  ]

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
      <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2.5}>
        Quick Actions
      </Typography>

      <Stack spacing={1.5}>
        {actions.map((act) => (
          <Card
            key={act.title}
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: "divider",
              bgcolor: (t) =>
                t.palette.mode === "dark" ? "background.default" : "grey.50",
              "&:hover": { borderColor: act.hoverBorderColor },
              transition: "border-color 0.2s ease",
            }}
          >
            <CardActionArea
              component={Link}
              href={act.href}
              sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}
            >
              <Avatar sx={{ bgcolor: act.avatarBg, color: act.avatarColor }}>
                {act.icon}
              </Avatar>
              <Box flexGrow={1}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.primary"
                >
                  {act.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {act.desc}
                </Typography>
              </Box>
              <ChevronRightIcon
                sx={{ color: "text.secondary", opacity: 0.5 }}
              />
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Paper>
  )
}
