"use client"
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead"
import { Box, Button, Grid, Stack, Typography } from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import JobInvitationCard from "./components/JobInvitationCard"

export default function JobInvitationsPage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <Box p={4}>Loading...</Box>
  }

  if (status === "unauthenticated") {
    return null
  }
  const invitations = [
    {
      id: 1,
      role: "Senior Full Stack Engineer",
      company: "Nexus Systems",
      location: "Remote / Singapore",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2oe_AgvRERU2bmGfXLeZoobO6aK1OR49jully9-vioREyapgs1icMbtIV5S_cBE_dGG3w7XCuRnZlbu06uPwPSYt4wbpANQ95zZwkK6g9KAtQV61bAj5_-Pr5-nzQ2BPzguT6IOFdh-tthR5VnAPdNv8vGcE6V6XJsre3hRfMUv4pQeCO8ybvaTEKdu9c2X7nAcUDCWsrW06Cw6ywx9MZjjUq6wsnZEtXyWdGANR6dpLzb4BZ08Wdya2z_-8kb-E7Wd5yhEJ67gY",
      receivedAt: "Received 2 hours ago",
      message:
        "Hi there! We've been following your contributions on GitHub and were impressed with your React expertise. We're scaling our fintech core team and think you'd be a perfect fit for our Senior role. Would you be open to a 15-minute intro call this Thursday?",
      tags: ["React", "Node.js", "TypeScript"],
      isNew: true,
    },
    {
      id: 2,
      role: "DevOps Specialist (Kubernetes)",
      company: "CloudScale Solutions",
      location: "Ho Chi Minh City",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_3pFVXZ786dhj8w1OT1TR-x7luH9IDmwxjeK_56eWfw-ER5bTbFCIhLdcd0KqAD1KkPsRDBbaUi7iig-fteNxb4doyJPjYvxNuB3PVahhhXv1xIuW-Q3CBYzXjc5OsApa4QXOFELFOTyTJv5zappIDGzeplRxJKBvFXfeWsaHG_0UZh28JC3T3vtlNIgQ1ERRCrnGgdVH4t1JgLhjNmbtxT8OKiVvXK_S6HmMRw5cJiwyLhoOO5i1WWwVH8KbqIVJHbyP5zC0TII",
      receivedAt: "Received Yesterday",
      message:
        "Greetings! Your profile caught our attention due to your recent AWS certification. We're looking for a lead to manage our migration to multi-cloud. Let's discuss how your background aligns with our 2024 roadmap.",
      tags: ["Kubernetes", "AWS", "Terraform"],
      isNew: false,
    },
  ]

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      {/* Page Header */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={900} gutterBottom>
          Job Invitations
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 700 }}
        >
          Manage direct inquiries from top IT companies. These organizations
          have reviewed your profile and believe your skills are a match for
          their open positions.
        </Typography>
      </Box>

      {/* Stats/Filter Bar */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Stack direction="row" spacing={6}>
              <Box>
                <Typography
                  variant="overline"
                  color="primary"
                  fontWeight="bold"
                >
                  Total Received
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  12
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="overline"
                  color="success.main"
                  fontWeight="bold"
                >
                  Active
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  4
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                All
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{
                  borderRadius: 2,
                  color: "text.secondary",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                Pending
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* Invitations List */}
      <Stack spacing={3}>
        {invitations.map((invitation) => (
          <JobInvitationCard key={invitation.id} {...invitation} />
        ))}
      </Stack>

      {/* Empty State / Load More */}
      <Box
        sx={{
          mt: 4,
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <MarkEmailReadIcon
          sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
        />
        <Typography
          variant="body2"
          fontWeight={500}
          color="text.secondary"
          mb={2}
        >
          You've reached the end of your recent invitations.
        </Typography>
        <Button
          variant="text"
          color="primary"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          View Archived Invitations
        </Button>
      </Box>
    </Box>
  )
}
