"use client"
import {
  ArrowBack,
  CardMembership,
  CheckCircle,
  Code,
  Description,
  Download,
  ExpandMore,
  FolderSpecial,
  Palette,
  Person,
  School,
  Work,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import { getCandidateCvById, updateCandidateCv, syncCandidateCvPdf } from "@/apis/cvBuilder"
import { uploadCv } from "@/apis/file"
import { ICandidateCv, ICvContent, ICvThemeConfig } from "@/types/cvBuilder"
import { CvRenderer } from "../components/CvRenderer"
import { CertificatesForm } from "../components/forms/CertificatesForm"
import { EducationForm } from "../components/forms/EducationForm"
import { ExperienceForm } from "../components/forms/ExperienceForm"
import { PersonalInfoForm } from "../components/forms/PersonalInfoForm"
import { ProjectsForm } from "../components/forms/ProjectsForm"
import { SkillsForm } from "../components/forms/SkillsForm"
import { SummaryForm } from "../components/forms/SummaryForm"
import { ThemeSettingsForm } from "../components/forms/ThemeSettingsForm"
import { downloadCvPdf, exportCvToPdf } from "../utils/exportPdf"
import {
  DEFAULT_CV_CONTENT,
  DEFAULT_THEME_CONFIG,
  TEMPLATE_OPTIONS,
} from "../constants/defaultCvData"

export default function CvEditorPage() {
  const params = useParams()
  const router = useRouter()
  const cvId = Number(params?.id)

  const [cv, setCv] = useState<ICandidateCv | null>(null)
  const [title, setTitle] = useState("")
  const [templateId, setTemplateId] = useState("modern-it")
  const [themeConfig, setThemeConfig] =
    useState<ICvThemeConfig>(DEFAULT_THEME_CONFIG)
  const [content, setContent] = useState<ICvContent>(DEFAULT_CV_CONTENT)

  const [activeTab, setActiveTab] = useState(0)
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    "personalInfo",
  )
  const [zoomScale, setZoomScale] = useState(0.9)
  const [isLoading, setIsLoading] = useState(true)
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">(
    "saved",
  )
  const [isExporting, setIsExporting] = useState(false)

  const [toast, setToast] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({
    open: false,
    message: "",
    severity: "success",
  })

  // Debounce save timer ref
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)

  // Fetch CV by ID
  useEffect(() => {
    if (!cvId) return
    const loadCv = async () => {
      try {
        setIsLoading(true)
        const res = await getCandidateCvById(cvId)
        if (res.data) {
          const cvData = res.data
          setCv(cvData)
          setTitle(cvData.title)
          setTemplateId(cvData.templateId || "modern-it")
          if (cvData.themeConfig) setThemeConfig(cvData.themeConfig)
          if (cvData.content) setContent(cvData.content)
        }
      } catch (err: any) {
        console.error("Error loading CV:", err)
        setToast({
          open: true,
          message: "Không thể tải thông tin CV.",
          severity: "error",
        })
      } finally {
        setIsLoading(false)
        setTimeout(() => {
          initialLoadRef.current = false
        }, 500)
      }
    }
    loadCv()
  }, [cvId])

  // Trigger Auto-save when content, themeConfig, title, or templateId changes
  const triggerAutoSave = useCallback(
    (
      newContent: ICvContent,
      newTheme: ICvThemeConfig,
      newTitle: string,
      newTpl: string,
    ) => {
      if (initialLoadRef.current || !cvId) return
      setSaveState("saving")

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await updateCandidateCv(cvId, {
            title: newTitle,
            templateId: newTpl,
            themeConfig: newTheme,
            content: newContent,
          })
          setSaveState("saved")
        } catch (err) {
          console.error("Auto save error:", err)
          setSaveState("error")
        }
      }, 1000)
    },
    [cvId],
  )

  const handleContentChange = (newContent: ICvContent) => {
    setContent(newContent)
    triggerAutoSave(newContent, themeConfig, title, templateId)
  }

  const handleThemeChange = (newTheme: ICvThemeConfig) => {
    setThemeConfig(newTheme)
    triggerAutoSave(content, newTheme, title, templateId)
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    triggerAutoSave(content, themeConfig, newTitle, templateId)
  }

  const handleTemplateChange = (newTpl: string) => {
    setTemplateId(newTpl)
    triggerAutoSave(content, themeConfig, title, newTpl)
  }

  const handleExportPdf = async () => {
    try {
      setIsExporting(true)
      const safeName = (title || "cv").replace(/[^a-zA-Z0-9_\-\s]/g, "").trim().replace(/\s+/g, "_")

      // 1. Generate PDF blob once
      const pdfBlob = await exportCvToPdf(safeName || "cv")

      // 2. Trigger browser file download
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${safeName || "cv"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // 3. Automatically sync PDF to AWS S3 in the background for online job application
      try {
        const pdfFile = new File([pdfBlob], `${safeName || "cv"}.pdf`, { type: "application/pdf" })
        const uploadRes = await uploadCv(pdfFile)

        const uploadedUrl = (uploadRes.data as any)?.fileUrl || (typeof uploadRes.data === "string" ? uploadRes.data : undefined)
        if (uploadedUrl) {
          const syncRes = await syncCandidateCvPdf(cvId, uploadedUrl)
          if (syncRes.data) {
            setCv(syncRes.data)
          } else {
            setCv((prev) => (prev ? { ...prev, pdfUrl: uploadedUrl } : null))
          }
        }
        setToast({ open: true, message: "Đã xuất và lưu CV lên hệ thống thành công!", severity: "success" })
      } catch (uploadErr) {
        console.warn("Background S3 upload warning:", uploadErr)
        setToast({ open: true, message: "Đã tải file PDF về máy thành công!", severity: "success" })
      }
    } catch (err) {
      console.error("PDF export error:", err)
      setToast({ open: true, message: "Lỗi khi xuất PDF. Vui lòng thử lại.", severity: "error" })
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
      {/* ── Top Header Navigation Bar ───────────────────────────────────── */}
      <Paper
        elevation={2}
        className="no-print"
        sx={{
          p: 1.5,
          px: 3,
          mb: 2,
          borderRadius: 2,
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          bgcolor: "background.paper",
        }}
      >
        {/* Left: Back & Title */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={() => router.push("/candidate/cv-builder")}
            size="small"
          >
            <ArrowBack />
          </IconButton>

          <TextField
            variant="standard"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: { fontWeight: 800, fontSize: "1.1rem" },
            }}
            placeholder="Tên bản CV..."
            sx={{ minWidth: 220 }}
          />

          {/* Auto-save Status Indicator */}
          {saveState === "saving" && (
            <Chip
              icon={<CircularProgress size={12} color="inherit" />}
              label="Đang lưu..."
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
          {saveState === "saved" && (
            <Chip
              icon={<CheckCircle style={{ fontSize: 14 }} />}
              label="Đã lưu"
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </Box>

        {/* Right: Controls & Actions */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Template Selector */}
          <Select
            size="small"
            value={templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            sx={{ minWidth: 150, fontSize: 13 }}
          >
            {TEMPLATE_OPTIONS.map((tpl) => (
              <MenuItem key={tpl.id} value={tpl.id}>
                {tpl.name}
              </MenuItem>
            ))}
          </Select>

          {/* Zoom Controls */}
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            className="bg-gray-100 rounded p-0.5"
          >
            <Tooltip title="Thu nhỏ">
              <IconButton
                size="small"
                onClick={() =>
                  setZoomScale((prev) => Math.max(0.6, prev - 0.1))
                }
              >
                <ZoomOut fontSize="small" />
              </IconButton>
            </Tooltip>
            <span className="text-xs font-semibold px-1 text-gray-700">
              {Math.round(zoomScale * 100)}%
            </span>
            <Tooltip title="Phóng to">
              <IconButton
                size="small"
                onClick={() =>
                  setZoomScale((prev) => Math.min(1.2, prev + 0.1))
                }
              >
                <ZoomIn fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Export & Sync PDF */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={isExporting ? <CircularProgress size={16} color="inherit" /> : <Download />}
            onClick={handleExportPdf}
            disabled={isExporting}
            sx={{ fontWeight: 800 }}
          >
            {isExporting ? "Đang tạo PDF..." : "Tải về PDF"}
          </Button>
        </Box>
      </Paper>

      {/* ── Main Split Container (Left Panel: Editor Forms, Right Panel: Live Preview) ── */}
      <Box display="flex" gap={3} sx={{ height: "calc(100vh - 150px)" }}>
        {/* Left Side Panel (40% width): Form Tabs & Accordions */}
        <Paper
          elevation={2}
          className="no-print"
          sx={{
            width: "42%",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              icon={<Description fontSize="small" />}
              iconPosition="start"
              label="Nội dung CV"
            />
            <Tab
              icon={<Palette fontSize="small" />}
              iconPosition="start"
              label="Giao diện & Style"
            />
          </Tabs>

          {/* Tab 0: Content Form Accordions */}
          {activeTab === 0 && (
            <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
              {/* Personal Info */}
              <Accordion
                expanded={expandedAccordion === "personalInfo"}
                onChange={(_, isExp) =>
                  setExpandedAccordion(isExp ? "personalInfo" : false)
                }
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Person color="primary" fontSize="small" />
                    <Typography fontWeight={700} fontSize={14}>
                      Thông Tin Cá Nhân
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <PersonalInfoForm
                    data={content.personalInfo}
                    onChange={(val) =>
                      handleContentChange({ ...content, personalInfo: val })
                    }
                  />
                </AccordionDetails>
              </Accordion>

              {/* Summary */}
              <Accordion
                expanded={expandedAccordion === "summary"}
                onChange={(_, isExp) =>
                  setExpandedAccordion(isExp ? "summary" : false)
                }
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Description color="primary" fontSize="small" />
                    <Typography fontWeight={700} fontSize={14}>
                      Tóm Tắt Bản Thân
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <SummaryForm
                    data={content.summary}
                    onChange={(val) =>
                      handleContentChange({ ...content, summary: val })
                    }
                  />
                </AccordionDetails>
              </Accordion>

              {/* Experience */}
              <Accordion
                expanded={expandedAccordion === "experience"}
                onChange={(_, isExp) =>
                  setExpandedAccordion(isExp ? "experience" : false)
                }
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Work color="primary" fontSize="small" />
                    <Typography fontWeight={700} fontSize={14}>
                      Kinh Nghiệm Làm Việc ({content.experience?.length || 0})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <ExperienceForm
                    data={content.experience || []}
                    onChange={(val) =>
                      handleContentChange({ ...content, experience: val })
                    }
                  />
                </AccordionDetails>
              </Accordion>

              {/* Projects */}
              <Accordion
                expanded={expandedAccordion === "projects"}
                onChange={(_, isExp) =>
                  setExpandedAccordion(isExp ? "projects" : false)
                }
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <FolderSpecial color="primary" fontSize="small" />
                    <Typography fontWeight={700} fontSize={14}>
                      Dự Án Tiêu Biểu ({content.projects?.length || 0})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <ProjectsForm
                    data={content.projects || []}
                    onChange={(val) =>
                      handleContentChange({ ...content, projects: val })
                    }
                  />
                </AccordionDetails>
              </Accordion>

              {/* Skills */}
              <Accordion
                expanded={expandedAccordion === "skills"}
                onChange={(_, isExp) =>
                  setExpandedAccordion(isExp ? "skills" : false)
                }
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Code color="primary" fontSize="small" />
                    <Typography fontWeight={700} fontSize={14}>
                      Kỹ Năng Chuyên Môn ({content.skills?.length || 0})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <SkillsForm
                    data={content.skills || []}
                    onChange={(val) =>
                      handleContentChange({ ...content, skills: val })
                    }
                  />
                </AccordionDetails>
              </Accordion>

              {/* Education */}
              <Accordion
                expanded={expandedAccordion === "education"}
                onChange={(_, isExp) =>
                  setExpandedAccordion(isExp ? "education" : false)
                }
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <School color="primary" fontSize="small" />
                    <Typography fontWeight={700} fontSize={14}>
                      Học Vấn ({content.education?.length || 0})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <EducationForm
                    data={content.education || []}
                    onChange={(val) =>
                      handleContentChange({ ...content, education: val })
                    }
                  />
                </AccordionDetails>
              </Accordion>

              {/* Certificates */}
              <Accordion
                expanded={expandedAccordion === "certificates"}
                onChange={(_, isExp) =>
                  setExpandedAccordion(isExp ? "certificates" : false)
                }
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <CardMembership color="primary" fontSize="small" />
                    <Typography fontWeight={700} fontSize={14}>
                      Chứng Chỉ ({content.certificates?.length || 0})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <CertificatesForm
                    data={content.certificates || []}
                    onChange={(val) =>
                      handleContentChange({ ...content, certificates: val })
                    }
                  />
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

          {/* Tab 1: Theme & Style Form */}
          {activeTab === 1 && (
            <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2.5 }}>
              <ThemeSettingsForm
                config={themeConfig}
                onChange={handleThemeChange}
              />
            </Box>
          )}
        </Paper>

        {/* Right Side Panel (58% width): Realtime A4 Canvas Preview */}
        <Box sx={{ width: "58%", height: "100%", overflow: "auto" }}>
          <CvRenderer
            content={content}
            themeConfig={themeConfig}
            templateId={templateId}
            scale={zoomScale}
          />
        </Box>
      </Box>

      {/* Snackbar Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
