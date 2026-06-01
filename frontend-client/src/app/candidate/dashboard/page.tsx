"use client"
import { AppStatus } from "@/app/candidate/commons/types"
import { Box, Grid } from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import QuickActions from "./components/QuickActions"
import RecentApplications, {
  RecentApplication,
} from "./components/RecentApplications"
import RecommendedJobs, { RecommendedJob } from "./components/RecommendedJobs"
import StatsCards from "./components/StatsCards"
import WelcomeBanner from "./components/WelcomeBanner"

// Mock Data
const recentApplications: RecentApplication[] = [
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
  },
  {
    id: 3,
    jobTitle: "DevOps Engineer",
    company: "FinFlow Banking",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ1Os5R9WU9IdNC0aMIK4PuZq_0uyeeL9jsv9YFPSY7aoJIH7JS7RR-vZKEKJo-Cs_MP2N0whkfS8C2ASnCBnRtWjE5nxZ5_y3Ratx7-BF3-t3yQhubbN_zoqT2AHcvT3DrARG9UTDoB2y3yiQ2Zo4GqlLVOjrL6Gd1JBDbW-CDn1T9sdcD7A6Sg2roc1vtqOQIXzJPfN8m63f-O8rJbkJIsEaaHae1ikxZbSbSo2y72Et4kJExNMhST7RiFcZecK9I8-0WJcFKpM",
    location: "Da Nang, Vietnam",
    appliedTime: "5 days ago",
    status: "reviewing",
  },
]

const recommendedJobs: RecommendedJob[] = [
  {
    id: 101,
    jobTitle: "Senior Frontend Engineer (React/TypeScript)",
    company: "VNG Corporation",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlS6x1wVLH2f6_ItCgLc_KLQlz-2L7MGzeUk0eLqlVixTsiJRIBTm9RJsTjIIOH6gav2C4evh2ic_HkDQzTQR5bZsUW75ebOTA_zmImggcfX9dF5DlsWNpPEoBVlUfU4471AcFDFY_WNuyM5BEAf5G50NCTzxvQUKhHiWgRBTTE9sW2WIWGqXX_KPcJ1xQJYeK5lSWu-BR0jo1E2r2p3Ygh6GBs8ouFhecXRYUewEyXrNAPgY-6h-p46HDVHGBTEaC2c-IjA02Lkw",
    location: "Ho Chi Minh City",
    salary: "$2,500 - $3,800",
    tags: ["ReactJS", "TypeScript", "Next.js"],
  },
  {
    id: 102,
    jobTitle: "Java Backend Tech Lead",
    company: "Techcombank",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-10mp5hpBYPYACOv0oAE4NVts1w3iicYo1LHmZ6aOjTwy36kjw_b5hjSHkG5-CcBQdzeJHzHZXJ0cb8wjkUjqf9Clb_2RVdNNjZ9vun7hfG6ga_LAwzfGtOqGGFu2DaxH3RUu5ABmX9AHvuomLFFryhv7dFfuAaufrptCkjOwYmJbBrz-Vn3Iq6cN2-lnVIk8DWt1AzADioUj3vYF9hWPV-urnaUgYC6bhh4f4i7z0VtElPJ_HCz6A99WClLoofKHsdE2-eEJnos",
    location: "Hanoi, Vietnam",
    salary: "$3,000 - $4,500",
    tags: ["Java", "Spring Boot", "Microservices"],
  },
]

export default function CandidateDashboardPage() {
  const { data: session, status } = useSession()
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

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Welcome Banner */}
      <WelcomeBanner userName={session?.user?.name} />

      {/* Main Grid */}
      <Grid container spacing={4}>
        {/* Left Side: Stats & Recent Apps */}
        <Grid item xs={12} lg={8}>
          {/* Stats Cards */}
          <StatsCards
            appliedCount={3}
            savedCount={0}
            invitationCount={0}
          />

          {/* Recent Applications Section */}
          <RecentApplications applications={recentApplications} />
        </Grid>

        {/* Right Side: Quick Actions & Recommendations */}
        <Grid item xs={12} lg={4}>
          <Box display="flex" flexDirection="column" gap={4}>
            {/* Quick Actions Card */}
            <QuickActions />

            {/* Recommended Jobs Card */}
            <RecommendedJobs jobs={recommendedJobs} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
