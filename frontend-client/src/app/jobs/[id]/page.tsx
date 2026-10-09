"use client"

import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import AppTheme from "@/shared-theme/AppTheme"
import { fetchJobs, getJobById } from "@/apis/job"
import { getCompanyById } from "@/apis/company"
import { checkJobApplied } from "@/apis/resume"
import { ICompany, IJob } from "@/types/backend"
import { getApplyActionState, getAppliedCheckState } from "@/common/application/applicationStates.mjs"
import { isCandidateRole } from "@/common/security/frontendSecurity.mjs"
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
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { getJobDetailFailureState } from "@/common/discovery/discoveryStates.mjs"
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
  const { t } = useTranslation()
  const jobId = Number(params?.id)

  const { data: session, status } = useSession()

  const [job, setJob] = useState<IJob | null>(null)
  const [company, setCompany] = useState<ICompany | null>(null)
  const [similarJobs, setSimilarJobs] = useState<IJob[]>([])
  const [loading, setLoading] = useState(true)
  const [loadFailure, setLoadFailure] = useState<"notFound" | "error" | null>(null)
  const detailRequestId = useRef(0)

  const [appliedCheck, setAppliedCheck] = useState<{
    key: string | null
    state: "idle" | "loading" | "notApplied" | "applied" | "error"
  }>({ key: null, state: "idle" })
  const [appliedCheckRetry, setAppliedCheckRetry] = useState(0)
  const [openApplyModal, setOpenApplyModal] = useState(false)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "info" | "error" | "warning",
  })

  // Load job details and company info
  const loadJobData = useCallback(async () => {
    const currentRequestId = ++detailRequestId.current
    if (!jobId || isNaN(jobId)) {
      setLoading(false)
      setJob(null)
      setLoadFailure("error")
      return
    }

    setLoading(true)
    setJob(null)
    setCompany(null)
    setLoadFailure(null)
    try {
      const res = await getJobById(jobId)
      if (res?.data) {
        const jobData = res.data
        if (currentRequestId === detailRequestId.current) setJob(jobData)

        // Fetch company details if companyId exists
        if (jobData.companyId) {
          getCompanyById(jobData.companyId)
            .then((cRes) => {
              if (currentRequestId === detailRequestId.current && cRes?.data) {
                setCompany(cRes.data)
              }
            })
            .catch(() => {})
        }
      } else {
        if (currentRequestId === detailRequestId.current) {
          setJob(null)
          setLoadFailure("error")
        }
      }
    } catch (error) {
      if (currentRequestId === detailRequestId.current) {
        setJob(null)
        setLoadFailure(getJobDetailFailureState(error))
      }
    } finally {
      if (currentRequestId === detailRequestId.current) setLoading(false)
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

  const isCandidate = status === "authenticated" && isCandidateRole(session?.user?.role)
  const applicationCheckKey = isCandidate
    ? `${session?.user?.id ?? "candidate"}:${jobId}`
    : null

  // Check only the authenticated candidate's application state.
  useEffect(() => {
    if (!applicationCheckKey || !jobId) {
      setAppliedCheck({ key: null, state: "idle" })
      return
    }

    let isMounted = true
    setAppliedCheck({ key: applicationCheckKey, state: "loading" })
    checkJobApplied(jobId)
      .then((res) => {
        if (isMounted) {
          setAppliedCheck({
            key: applicationCheckKey,
            state: getAppliedCheckState(res),
          })
        }
      })
      .catch(() => {
        if (isMounted) {
          setAppliedCheck({ key: applicationCheckKey, state: "error" })
        }
      })

    return () => {
      isMounted = false
    }
  }, [applicationCheckKey, jobId, appliedCheckRetry])

  const currentCheckState = appliedCheck.key === applicationCheckKey
    ? appliedCheck.state
    : "loading"
  const applyActionState = getApplyActionState({
    sessionStatus: status,
    role: session?.user?.role,
    checkState: currentCheckState,
  })

  const handleApplyClick = () => {
    if (applyActionState === "guest") {
      setSnackbar({
        open: true,
        message: t("application.signInPrompt"),
        severity: "warning",
      })
      setTimeout(() => {
        router.push("/signin")
      }, 1500)
      return
    }
    if (applyActionState === "ready") setOpenApplyModal(true)
  }

  const handleApplySuccess = () => {
    if (applicationCheckKey) {
      setAppliedCheck({ key: applicationCheckKey, state: "applied" })
    }
    setSnackbar({
      open: true,
      message: t("application.success"),
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
                {t("discovery.jobDetailLoading")}
              </Typography>
            </Box>
          ) : loadFailure === "notFound" ? (
            <Box py={10} textAlign="center">
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {t("discovery.jobNotFound")}
              </Alert>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push("/jobs")}
                sx={{ borderRadius: 2 }}
              >
                {t("discovery.backToJobs")}
              </Button>
            </Box>
          ) : loadFailure === "error" || !job ? (
            <Box py={10} textAlign="center">
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={() => void loadJobData()}>
                    {t("discovery.retry")}
                  </Button>
                }
              >
                {t("discovery.jobDetailLoadError")}
              </Alert>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push("/jobs")}
                sx={{ borderRadius: 2 }}
              >
                {t("discovery.backToJobs")}
              </Button>
            </Box>
          ) : (
            <>
              {/* Header */}
              {headerJob && (
                <JobDetailHeader
                  jobId={job.id}
                  job={headerJob}
                  applyActionState={applyActionState}
                  onApply={handleApplyClick}
                  onRetryApplicationCheck={() => setAppliedCheckRetry((count) => count + 1)}
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
      {job && isCandidate && (
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

