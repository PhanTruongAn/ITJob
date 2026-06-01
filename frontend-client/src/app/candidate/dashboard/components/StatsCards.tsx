"use client"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import FavoriteIcon from "@mui/icons-material/Favorite"
import MailIcon from "@mui/icons-material/Mail"
import SendIcon from "@mui/icons-material/Send"
import { Box, Card, CardActionArea, Grid, Typography } from "@mui/material"
import Link from "next/link"

interface StatsCardsProps {
  appliedCount?: number
  savedCount?: number
  invitationCount?: number
}

export default function StatsCards({
  appliedCount = 3,
  savedCount = 0,
  invitationCount = 0,
}: StatsCardsProps) {
  const cards = [
    {
      label: "Applied Jobs",
      count: appliedCount,
      href: "/candidate/my-jobs?status=applied",
      icon: <SendIcon fontSize="small" />,
      iconBg: "#cee4fe",
      iconColor: "#0a4c9c",
    },
    {
      label: "Saved Jobs",
      count: savedCount,
      href: "/candidate/my-jobs",
      icon: <FavoriteIcon fontSize="small" />,
      iconBg: "#fab2b2ff",
      iconColor: "#991b1b",
    },
    {
      label: "Job invitations",
      count: invitationCount,
      href: "/candidate/job-invitations",
      icon: <MailIcon fontSize="small" />,
      iconBg: "#d4f7d4ff",
      iconColor: "#166534",
    },
  ]

  return (
    <Grid container spacing={3} mb={4}>
      {cards.map((card) => (
        <Grid item xs={12} sm={4} key={card.label}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0px 8px 30px rgba(0,0,0,0.06)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardActionArea component={Link} href={card.href} sx={{ p: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    bgcolor: card.iconBg,
                    color: card.iconColor,
                    display: "flex",
                  }}
                >
                  {card.icon}
                </Box>
                <ChevronRightIcon
                  sx={{ color: "text.secondary", opacity: 0.5 }}
                />
              </Box>
              <Typography variant="h3" fontWeight={900} color="text.primary">
                {card.count}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
                mt={0.5}
              >
                {card.label}
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
