"use client"

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DescriptionIcon from "@mui/icons-material/Description"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import SendIcon from "@mui/icons-material/Send"
import { useSession } from "next-auth/react"
import React, { useCallback, useEffect, useState } from "react"
import { getUserCvs, uploadCv } from "@/apis/file"
import { applyJob } from "@/apis/resume"
import { IFile } from "@/types/backend"

interface ApplyJobModalProps {
  open: boolean
  onClose: () => void
  jobId: number
  jobTitle: string
  companyName: string
  onSuccess: () => void
}

export default function ApplyJobModal({
  open,
  onClose,
  jobId,
  jobTitle,
  companyName,
  onSuccess,
}: ApplyJobModalProps) {
  const { data: session } = useSession()
  const user = session?.user

  const [tabIndex, setTabIndex] = useState<number>(0)
  const [cvList, setCvList] = useState<IFile[]>([])
  const [selectedCvUrl, setSelectedCvUrl] = useState<string>("")
  const [loadingCvs, setLoadingCvs] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Form states
  const [candidateName, setCandidateName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setCandidateName(user.name || "")
      setEmail(user.email || "")
      setPhoneNumber(user.phone || "")
    }
  }, [user, open])

  // Fetch CVs list when modal opens
  const fetchCvs = useCallback(async () => {
    try {
      setLoadingCvs(true)
      const res = await getUserCvs()
      if (res.data) {
        setCvList(res.data)
        const defaultCv = res.data.find((c) => c.isDefault) || res.data[0]
        if (defaultCv) {
          setSelectedCvUrl(defaultCv.fileUrl)
        }
      }
    } catch (err: any) {
      console.error("Failed to load CVs:", err)
    } finally {
      setLoadingCvs(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      fetchCvs()
      setErrorMessage("")
    }
  }, [open, fetchCvs])

  // Handle direct file upload from modal
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setErrorMessage("")
      const res = await uploadCv(file)
      if (res.data) {
        setSelectedCvUrl(res.data.fileUrl)
        await fetchCvs()
        setTabIndex(0) // Switch back to select tab with new CV selected
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Không thể tải file CV lên. Vui lòng thử lại."
      setErrorMessage(msg)
    } finally {
      setUploading(false)
    }
  }

  // Handle submit application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!candidateName.trim()) {
      setErrorMessage("Vui lòng nhập Họ và tên.")
      return
    }
    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập Email liên hệ.")
      return
    }
    if (!phoneNumber.trim()) {
      setErrorMessage("Vui lòng nhập Số điện thoại.")
      return
    }
    if (!selectedCvUrl) {
      setErrorMessage("Vui lòng chọn hoặc tải lên file CV để ứng tuyển.")
      return
    }

    try {
      setSubmitting(true)
      const res = await applyJob({
        jobId,
        candidateName: candidateName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        url: selectedCvUrl,
        note: note.trim() || undefined,
      })

      if (res.data || res.statusCode === 201) {
        onSuccess()
        onClose()
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Ứng tuyển thất bại. Vui lòng thử lại."
      setErrorMessage(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="primary.main">
            Ứng tuyển công việc
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {jobTitle} • <strong>{companyName}</strong>
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 3 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Form Candidate Information */}
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            1. Thông tin cá nhân
          </Typography>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ và tên *"
                fullWidth
                size="small"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điện thoại *"
                fullWidth
                size="small"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0912345678"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email nhận phản hồi *"
                fullWidth
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@gmail.com"
              />
            </Grid>
          </Grid>

          {/* CV Selection Section */}
          <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
            2. Chọn CV ứng tuyển
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(_, val) => setTabIndex(val)}
            sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="CV đã lưu" />
            <Tab label="Tải CV mới" />
          </Tabs>

          {tabIndex === 0 && (
            <Box mb={4}>
              {loadingCvs ? (
                <Box display="flex" justifyContent="center" py={3}>
                  <CircularProgress size={30} />
                </Box>
              ) : cvList.length > 0 ? (
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={selectedCvUrl}
                    onChange={(e) => setSelectedCvUrl(e.target.value)}
                  >
                    <Stack spacing={1.5}>
                      {cvList.map((cv) => (
                        <Paper
                          key={cv.id}
                          variant="outlined"
                          onClick={() => setSelectedCvUrl(cv.fileUrl)}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: "pointer",
                            borderColor:
                              selectedCvUrl === cv.fileUrl
                                ? "primary.main"
                                : "divider",
                            bgcolor:
                              selectedCvUrl === cv.fileUrl
                                ? "action.hover"
                                : "background.paper",
                            transition: "all 0.2s",
                          }}
                        >
                          <FormControlLabel
                            value={cv.fileUrl}
                            control={<Radio size="small" />}
                            label={
                              <Box display="flex" alignItems="center" gap={1.5}>
                                <DescriptionIcon color="primary" />
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                  >
                                    {cv.fileName}
                                    {cv.isDefault && (
                                      <Typography
                                        component="span"
                                        variant="caption"
                                        sx={{
                                          ml: 1,
                                          bgcolor: "primary.main",
                                          color: "white",
                                          px: 1,
                                          py: 0.2,
                                          borderRadius: 1,
                                          fontWeight: 600,
                                        }}
                                      >
                                        Mặc định
                                      </Typography>
                                    )}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {(cv.fileSize / (1024 * 1024)).toFixed(2)} MB • {cv.fileExtension?.toUpperCase()}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            sx={{ width: "100%", m: 0 }}
                          />
                        </Paper>
                      ))}
                    </Stack>
                  </RadioGroup>
                </FormControl>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Bạn chưa lưu tệp CV nào trên hệ thống. Hãy chuyển sang tab &quot;Tải CV mới&quot; để tải file CV của bạn lên.
                </Alert>
              )}
            </Box>
          )}

          {tabIndex === 1 && (
            <Box mb={4}>
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  borderRadius: 3,
                  borderStyle: "dashed",
                  textAlign: "center",
                  bgcolor: "action.hover",
                }}
              >
                {uploading ? (
                  <Stack spacing={2} alignItems="center">
                    <CircularProgress size={36} color="primary" />
                    <Typography variant="body2">
                      Đang tải file CV lên AWS S3...
                    </Typography>
                  </Stack>
                ) : (
                  <Stack spacing={1.5} alignItems="center">
                    <CloudUploadIcon
                      sx={{ fontSize: 48, color: "primary.main" }}
                    />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Tải file CV trực tiếp từ máy tính
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hỗ trợ định dạng .pdf, .doc, .docx (Dung lượng tối đa 10MB)
                    </Typography>
                    <Button
                      variant="contained"
                      component="label"
                      size="medium"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 1, textTransform: "none", borderRadius: 2 }}
                    >
                      Chọn file CV
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                    </Button>
                  </Stack>
                )}
              </Paper>
            </Box>
          )}

          {/* Cover Note Section */}
          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            3. Thư giới thiệu / Ghi chú (Không bắt buộc)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Viết một đoạn giới thiệu ngắn gọn lý do tại sao bạn phù hợp với vị trí này..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            disabled={submitting}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting || uploading}
            startIcon={
              submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            sx={{ textTransform: "none", borderRadius: 2, px: 3, fontWeight: 700 }}
          >
            {submitting ? "Đang gửi..." : "Gửi hồ sơ ứng tuyển"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
