"use client"
import { Box, Paper, Stack, Typography } from "@mui/material"
import { useState } from "react"
import ApplicationCard, { Application } from "./components/ApplicationCard"
import FilterTabBar, { FilterTab } from "./components/FilterTabBar"
import StatsBentoGrid from "./components/StatsBentoGrid"

// ─── Mock Data ────────────────────────────────────────────────────────────────
const applications: Application[] = [
  {
    id: 1,
    jobTitle: "Senior Full Stack Engineer",
    company: "CloudNexus Solutions",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlS6x1wVLH2f6_ItCgLc_KLQlz-2L7MGzeUk0eLqlVixTsiJRIBTm9RJsTjIIOH6gav2C4evh2ic_HkDQzTQR5bZsUW75ebOTA_zmImggcfX9dF5DlsWNpPEoBVlUfU4471AcFDFY_WNuyM5BEAf5G50NCTzxvQUKhHiWgRBTTE9sW2WIWGqXX_KPcJ1xQJYeK5lSWu-BR0jo1E2r2p3Ygh6GBs8ouFhecXRYUewEyXrNAPgY-6h-p46HDVHGBTEaC2c-IjA02Lkw",
    location: "Ho Chi Minh City",
    appliedTime: "2 days ago",
    salary: "$3,500 - $5,000",
    status: "hired",
  },
  {
    id: 2,
    jobTitle: "Senior React Developer",
    company: "Aura Intelligence",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-10mp5hpBYPYACOv0oAE4NVts1w3iicYo1LHmZ6aOjTwy36kjw_b5hjSHkG5-CcBQdzeJHzHZXJ0cb8wjkUjqf9Clb_2RVdNNjZ9vun7hfG6ga_LAwzfGtOqGGFu2DaxH3RUu5ABmX9AHvuomLFFryhv7dFfuAaufrptCkjOwYmJbBrz-Vn3Iq6cN2-lnVIk8DWt1AzADioUj3vYF9hWPV-urnaUgYC6bhh4f4i7z0VtElPJ_HCz6A99WClLoofKHsdE2-eEJnos",
    location: "Remote",
    appliedTime: "1 week ago",
    salary: "$2,800 - $4,200",
    status: "interviewing",
    interviewDate: "Tue, 14 Nov • 10:00 AM",
  },
  {
    id: 3,
    jobTitle: "DevOps Engineer",
    company: "FinFlow Banking",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ1Os5R9WU9IdNC0aMIK4PuZq_0uyeeL9jsv9YFPSY7aoJIH7JS7RR-vZKEKJo-Cs_MP2N0whkfS8C2ASnCBnRtWjE5nxZ5_y3Ratx7-BF3-t3yQhubbN_zoqT2AHcvT3DrARG9UTDoB2y3yiQ2Zo4GqlLVOjrL6Gd1JBDbW-CDn1T9sdcD7A6Sg2roc1vtqOQIXzJPfN8m63f-O8rJbkJIsEaaHae1ikxZbSbSo2y72Et4kJExNMhST7RiFcZecK9I8-0WJcFKpM",
    location: "Da Nang, Vietnam",
    appliedTime: "5 days ago",
    status: "reviewing",
    lastUpdated: "Last updated yesterday",
  },
  {
    id: 4,
    jobTitle: "UI/UX Designer (Product)",
    company: "StreamLine UX",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_bN3yQEOhN6csAHJBRdNzpTQxEmOsC__9njk-QXBuBxiqj18grh9j_ZkLwESWRMC0KsRkI69m4gN1FCagrqbmHgjmRaYJ3ESo93DLekk5sQB5gWt-gTE8HyCF-6AvH6779Xsnp8wcZJP6Ogu-IjQTfyiGJ0vzxiLtxIclg3U5ofkRlwasqfSARmUv4yUXst2RgNoK1t5EtiUo3KR62f1Ly_JZXiqKYVpwciPpAtGm4CWDYvYNy7yj0v7FQ1oQf7S0NoHSAMv8Iqk",
    location: "Ho Chi Minh City",
    appliedTime: "3 weeks ago",
    status: "not_selected",
  },
]

const stats = [
  {
    label: "Applied",
    value: 12,
    sub: "+2 this week",
    subColor: "success.main",
  },
  { label: "Interviews", value: 4, sub: "Active", subColor: "success.main" },
  { label: "Reviewing", value: 6, sub: null, subColor: null },
  {
    label: "Offers",
    value: 1,
    sub: "NEW",
    subColor: "success.main",
    isOffer: true,
  },
]

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyJobsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")

  const filteredApps =
    activeFilter === "all"
      ? applications
      : applications.filter((a) => a.status === activeFilter)

  return (
    <Box>
      {/* Header */}
      <Box mb={5}>
        <Typography
          variant="h4"
          fontWeight={900}
          color="primary.main"
          gutterBottom
        >
          My Jobs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your applications and career progress.
        </Typography>
      </Box>

      {/* Stats Bento Grid */}
      <StatsBentoGrid stats={stats} />

      {/* Filter Tab Bar */}
      <FilterTabBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Application Cards */}
      <Stack spacing={2.5}>
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Không có đơn ứng tuyển nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bắt đầu ứng tuyển để theo dõi tiến trình của bạn tại đây.
            </Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  )
}
