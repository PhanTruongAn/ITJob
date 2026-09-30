"use client"

import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import AppTheme from "@/shared-theme/AppTheme"
import { fetchJobs, getJobById } from "@/apis/job"
import { getCompanyById } from "@/apis/company"
import { checkJobApplied } from "@/apis/resume"
import { ICompany, IJob } from "@/types/backend"
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import ApplyJobModal from "./components/ApplyJobModal"
import JobDescriptionSection from "./components/JobDescriptionSection"
import JobDetailHeader from "./components/JobDetailHeader"
import JobDetailSidebar from "./components/JobDetailSidebar"

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return "Mới đăng"
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes} phút trước`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} giờ trước`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} ngày trước`
    const months = Math.floor(days / 30)
    return `${months} tháng trước`
  } catch {
    return "Mới đăng"
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = Number(params?.id)

  const { data: session, status } = useSession()

  const [job, setJob] = useState<IJob | null>(null)
  const [company, setCompany] = useState<ICompany | null>(null)
  const [similarJobs, setSimilarJobs] = useState<IJob[]>([])
  const [loading, setLoading] = useState(true)

  const [isApplied, setIsApplied] = useState(false)
  const [openApplyModal, setOpenApplyModal] = useState(false)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "info" | "error" | "warning",
  })

  // Load job details and company info
  const loadJobData = useCallback(async () => {
    if (!jobId || isNaN(jobId)) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await getJobById(jobId)
      if (res?.data) {
        const jobData = res.data
        setJob(jobData)

        // Fetch company details if companyId exists
        if (jobData.companyId) {
          getCompanyById(jobData.companyId)
            .then((cRes) => {
              if (cRes?.data) setCompany(cRes.data)
            })
            .catch(() => {})
        }
      } else {
        setJob(null)
      }
    } catch {
      setJob(null)
    } finally {
      setLoading(false)
    }
  }, [jobId])

  useEffect(() => {
    loadJobData()
  }, [loadJobData])

  // Fetch similar / recommended jobs for sidebar
  useEffect(() => {
    fetchJobs({ pageSize: 4 })
      .then((res) => {
        if (res?.data?.result) {
          // Exclude current job from similar jobs list
          setSimilarJobs(res.data.result.filter((j) => j.id !== jobId))
        }
      })
      .catch(() => {})
  }, [jobId])

  // Check if current user has already applied for this job
  useEffect(() => {
    if (status !== "authenticated" || !jobId) return

    let isMounted = true
    checkJobApplied(jobId)
      .then((res) => {
        if (isMounted && res?.data) {
          setIsApplied(true)
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [status, jobId])

  const handleApplyClick = () => {
    if (!session?.user) {
      setSnackbar({
        open: true,
        message: "Vui lòng đăng nhập tài khoản ứng viên để ứng tuyển công việc này.",
        severity: "warning",
      })
      setTimeout(() => {
        router.push("/signin")
      }, 1500)
      return
    }
    setOpenApplyModal(true)
  }

  const handleApplySuccess = () => {
    setIsApplied(true)
    setSnackbar({
      open: true,
      message: "Ứng tuyển thành công! Nhà tuyển dụng sẽ xem xét hồ sơ của bạn sớm nhất.",
      severity: "success",
    })
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setSnackbar({
        open: true,
        message: "Đã sao chép liên kết vào bộ nhớ tạm!",
        severity: "info",
      })
    }
  }

  // Formatting job data for Header
  const headerJob = job
    ? {
        title: job.name,
        company: job.companyName || company?.name || "Công ty chưa cập nhật",
        logo: job.companyLogo || company?.logo || "",
        location: job.location || "Chưa cập nhật địa điểm",
        salaryText: job.salary ? `$${job.salary.toLocaleString()}` : "Thỏa thuận",
        postedTime: formatTimeAgo(job.startDate),
        jobType: job.jobType,
        level: job.level,
        quantity: job.quantity,
        endDate: job.endDate,
        isActive: job.isActive,
        rating: company?.rating,
        reviews: company?.reviews,
      }
    : null

  // Formatting job data for Description Section
  const descriptionJob = job
    ? {
        description: job.description || "Chưa có mô tả chi tiết.",
        requirementsTags:
          job.jobSkills
            ?.map((js) => js?.skillName)
            .filter((name): name is string => Boolean(name)) ?? [],
        companyInfo: {
          industry: company?.industry,
          companySize: company?.companySize,
          workingDays: company?.workingDays,
          overtime: company?.overtime,
          address: company?.address,
        },
      }
    : null

  // Formatting job & company data for Sidebar
  const sidebarJob = {
    companyId: company?.id || job?.companyId,
    companySize: company?.companySize || "50 - 200 nhân viên",
    website: company?.website || (company?.name ? `${company.name.toLowerCase().replace(/\s+/g, "")}.com` : "N/A"),
    companyDesc: company?.description || "Chưa có thông tin mô tả chi tiết về công ty.",
    industry: company?.industry,
    address: company?.address,
    overtime: company?.overtime,
    workingDays: company?.workingDays,
  }

  const formattedSimilarJobs = similarJobs.map((simJob) => ({
    id: simJob.id,
    title: simJob.name,
    company: simJob.companyName || "Công ty",
    companyLogo: simJob.companyLogo || "",
    location: simJob.location || "Việt Nam",
    salary: simJob.salary ? `$${simJob.salary.toLocaleString()}` : "Thỏa thuận",
    jobType: simJob.jobType,
    level: simJob.level,
  }))

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar />

      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.950" : "rgb(243, 245, 247)",
          pt: 12,
          pb: 10,
        }}
      >
        <Container maxWidth="lg">
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={15}
            >
              <CircularProgress size={44} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Đang tải chi tiết công việc...
              </Typography>
            </Box>
          ) : !job ? (
            <Box py={10} textAlign="center">
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                Không tìm thấy thông tin công việc hoặc công việc này đã ngừng tuyển dụng.
              </Alert>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push("/jobs")}
                sx={{ borderRadius: 2 }}
              >
                Quay lại danh sách việc làm
              </Button>
            </Box>
          ) : (
            <>
              {/* Header */}
              {headerJob && (
                <JobDetailHeader
                  jobId={job.id}
                  job={headerJob}
                  isApplied={isApplied}
                  onApply={handleApplyClick}
                />
              )}

              {/* Grid Layout */}
              <Grid container spacing={4}>
                {/* Left Content Area */}
                <Grid item xs={12} lg={8}>
                  {descriptionJob && <JobDescriptionSection job={descriptionJob} />}
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} lg={4}>
                  <JobDetailSidebar
                    job={sidebarJob}
                    similarJobs={formattedSimilarJobs}
                    onCopyLink={handleCopyLink}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>

      {/* Apply Job Modal */}
      {job && (
        <ApplyJobModal
          open={openApplyModal}
          onClose={() => setOpenApplyModal(false)}
          jobId={job.id}
          jobTitle={job.name}
          companyName={job.companyName || company?.name || ""}
          onSuccess={handleApplySuccess}
        />
      )}

      {/* Snackbar notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Footer />
      </Box>
    </AppTheme>
  )
}

