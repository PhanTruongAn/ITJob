"use client"
import { AppStatus, statusConfig } from "@/app/candidate/commons/types"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PaymentsIcon from "@mui/icons-material/Payments"
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import Link from "next/link"

export interface RecentApplication {
  id: number
  jobTitle: string
  company: string
  logo: string
  location: string
  appliedTime: string
  salary?: string
  status: AppStatus
}

interface RecentApplicationsProps {
  applications: RecentApplication[]
}

export default function RecentApplications({
  applications,
}: RecentApplicationsProps) {
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          Recent Applications
        </Typography>
        <Button
          component={Link}
          href="/candidate/my-jobs"
          size="small"
          endIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{ fontWeight: "bold" }}
        >
          View All
        </Button>
      </Box>

      <List disablePadding>
        {applications.map((app, index) => {
          const statusDetail = statusConfig[app.status]
          return (
            <Box key={app.id}>
              {index > 0 && <Divider sx={{ my: 2 }} />}
              <ListItem
                disableGutters
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                  p: 1,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: (t) =>
                      t.palette.mode === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "grey.50",
                  },
                  transition: "bgcolor 0.2s ease",
                }}
              >
                {/* Logo */}
                <Avatar
                  src={app.logo}
                  variant="rounded"
                  sx={{
                    width: 48,
                    height: 48,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "white",
                    p: 0.5,
                  }}
                />

                {/* Job Title & Company */}
                <Box flexGrow={1}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    {app.jobTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.company}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    mt={0.5}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                      gap={0.5}
                    >
                      <LocationOnIcon sx={{ fontSize: "0.9rem" }} />{" "}
                      {app.location}
                    </Typography>
                    {app.salary && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                      >
                        <PaymentsIcon sx={{ fontSize: "0.9rem" }} />{" "}
                        {app.salary}
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {/* Right Details: Time & Status */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "flex-start", sm: "flex-end" },
                    gap: 1,
                    mt: { xs: 1, sm: 0 },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Applied {app.appliedTime}
                  </Typography>
                  <Chip
                    label={statusDetail.label}
                    size="small"
                    sx={{
                      color: statusDetail.color,
                      bgcolor: statusDetail.bg,
                      fontWeight: "bold",
                      borderRadius: 1.5,
                    }}
                  />
                </Box>
              </ListItem>
            </Box>
          )
        })}
      </List>
    </Paper>
  )
}
