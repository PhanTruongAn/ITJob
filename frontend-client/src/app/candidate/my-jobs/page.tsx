"use client"

import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import ApplicationCard, { Application } from "./components/ApplicationCard"
import FilterTabBar, { FilterTab } from "./components/FilterTabBar"
import StatsBentoGrid from "./components/StatsBentoGrid"
import { getMyResumes } from "@/apis/resume"
import { IResume } from "@/types/backend"

export default function MyJobsPage() {
  const [resumes, setResumes] = useState<IResume[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getMyResumes()
      if (res.data) {
        setResumes(res.data)
      }
    } catch (err) {
      console.error("Error fetching my resumes:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  // Convert IResume to Application UI format
  const applications: Application[] = resumes.map((res) => ({
    id: res.id,
    jobTitle: res.jobName || `Công việc tuyển dụng #${res.jobId}`,
    company: res.companyName || "Nhà tuyển dụng",
    logo:
      res.companyLogo ||
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlS6x1wVLH2f6_ItCgLc_KLQlz-2L7MGzeUk0eLqlVixTsiJRIBTm9RJsTjIIOH6gav2C4evh2ic_HkDQzTQR5bZsUW75ebOTA_zmImggcfX9dF5DlsWNpPEoBVlUfU4471AcFDFY_WNuyM5BEAf5G50NCTzxvQUKhHiWgRBTTE9sW2WIWGqXX_KPcJ1xQJYeK5lSWu-BR0jo1E2r2p3Ygh6GBs8ouFhecXRYUewEyXrNAPgY-6h-p46HDVHGBTEaC2c-IjA02Lkw",
    location: "Việt Nam",
    appliedTime: res.createdAt
      ? new Date(res.createdAt).toLocaleDateString("vi-VN")
      : "Mới đây",
    status: res.status as any,
  }))

  const totalApplied = resumes.length
  const reviewingCount = resumes.filter(
    (r) => r.status === "PENDING" || r.status === "REVIEWING"
  ).length
  const approvedCount = resumes.filter((r) => r.status === "APPROVED").length
  const rejectedCount = resumes.filter((r) => r.status === "REJECTED").length

  const stats = [
    {
      label: "Tổng đã ứng tuyển",
      value: totalApplied,
      sub: totalApplied > 0 ? "Thành công" : null,
      subColor: "success.main",
    },
    {
      label: "Đang xem xét",
      value: reviewingCount,
      sub: reviewingCount > 0 ? "Đang xử lý" : null,
      subColor: "info.main",
    },
    {
      label: "Đã trúng tuyển / Đã duyệt",
      value: approvedCount,
      sub: approvedCount > 0 ? "Mới" : null,
      subColor: "success.main",
      isOffer: approvedCount > 0,
    },
    {
      label: "Bị từ chối",
      value: rejectedCount,
      sub: null,
      subColor: null,
    },
  ]

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
          Công việc của tôi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Theo dõi tất cả đơn ứng tuyển và trạng thái xét duyệt hồ sơ của bạn.
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
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
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
                Chưa có đơn ứng tuyển nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hãy tìm kiếm và ứng tuyển các vị trí việc làm hấp dẫn ngay hôm nay!
              </Typography>
            </Paper>
          )}
        </Stack>
      )}
    </Box>
  )
}

