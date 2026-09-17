"use client"
import { Alert, Box, CircularProgress, Grid, Snackbar, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import ManagedDocuments from "./components/ManagedDocuments"
import ProTipCard from "./components/ProTipCard"
import RecentActivityTimeline, { ActivityItem } from "./components/RecentActivityTimeline"
import StorageStatus from "./components/StorageStatus"
import UploadDropzone from "./components/UploadDropzone"
import { deleteCv, getUserCvs, setDefaultCv, uploadCv } from "@/apis/file"
import { IFile } from "@/types/backend"

export default function CVAttachmentPage() {
  const [cvFiles, setCvFiles] = useState<IFile[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })

  const [activityItems, setActivityItems] = useState<ActivityItem[]>([
    { id: 1, label: "Hệ thống đã sẵn sàng hỗ trợ tải CV lên AWS S3", time: "Vừa xong", type: "upload" },
  ])

  const fetchCvs = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getUserCvs()
      if (res.data) {
        setCvFiles(res.data)
      }
    } catch (err: any) {
      console.error("Error fetching CVs:", err)
      const errorMsg = err?.response?.data?.message || "Không thể tải danh sách CV."
      setToast({ open: true, message: errorMsg, severity: "error" })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCvs()
  }, [fetchCvs])

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const res = await uploadCv(file)
      if (res.data) {
        setToast({
          open: true,
          message: `Đã tải thành công CV "${file.name}" lên AWS S3!`,
          severity: "success",
        })
        setActivityItems((prev) => [
          { id: Date.now(), label: `Tải lên CV mới: ${file.name}`, time: "Vừa xong", type: "upload" },
          ...prev,
        ])
        await fetchCvs()
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      const errorMsg = err?.response?.data?.message || "Không thể tải CV lên. Vui lòng thử lại."
      setToast({ open: true, message: errorMsg, severity: "error" })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      const res = await setDefaultCv(id)
      if (res.data) {
        setToast({
          open: true,
          message: `Đã thiết lập CV "${res.data.fileName}" làm mặc định.`,
          severity: "success",
        })
        await fetchCvs()
      }
    } catch (err: any) {
      console.error("Set default error:", err)
      const errorMsg = err?.response?.data?.message || "Không thể thiết lập CV mặc định."
      setToast({ open: true, message: errorMsg, severity: "error" })
    }
  }

  const handleDelete = async (id: number) => {
    const targetFile = cvFiles.find((f) => f.id === id)
    if (!window.confirm(`Bạn có chắc chắn muốn xóa CV "${targetFile?.fileName || ""}" khỏi hệ thống và AWS S3?`)) {
      return
    }

    try {
      await deleteCv(id)
      setToast({
        open: true,
        message: "Đã xóa CV khỏi AWS S3 và cơ sở dữ liệu.",
        severity: "success",
      })
      setActivityItems((prev) => [
        { id: Date.now(), label: `Đã xóa CV: ${targetFile?.fileName}`, time: "Vừa xong", type: "download" },
        ...prev,
      ])
      await fetchCvs()
    } catch (err: any) {
      console.error("Delete error:", err)
      const errorMsg = err?.response?.data?.message || "Không thể xóa CV."
      setToast({ open: true, message: errorMsg, severity: "error" })
    }
  }

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
          CV Attachment
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={600}>
          Upload và quản lý các phiên bản hồ sơ CV của bạn. Tệp tin được lưu trữ bảo mật trên AWS S3 (Giới hạn tối đa 10MB/file).
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* ── Left Column (2/3) ─────────────────────────────────────────── */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            {/* Upload Dropzone */}
            <UploadDropzone
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
            />

            {/* Managed Documents */}
            {isLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <ManagedDocuments
                files={cvFiles}
                onSetDefault={handleSetDefault}
                onDelete={handleDelete}
              />
            )}
          </Stack>
        </Grid>

        {/* ── Right Column (1/3) ────────────────────────────────────────── */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Pro Tip */}
            <ProTipCard />

            {/* Storage Status */}
            <StorageStatus usedSlots={cvFiles.length} totalSlots={5} />

            {/* Recent Activity */}
            <RecentActivityTimeline activities={activityItems} />
          </Stack>
        </Grid>
      </Grid>

      {/* Snackbar Notification Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
