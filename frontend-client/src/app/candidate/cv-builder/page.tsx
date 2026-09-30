"use client"
import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"
import {
  Add,
  Edit,
  Star,
  StarBorder,
  FileCopy,
  Delete,
  PictureAsPdf,
  MoreVert,
  Article,
  WarningAmber,
} from "@mui/icons-material"
import {
  getMyCandidateCvs,
  createCandidateCv,
  setDefaultCandidateCv,
  duplicateCandidateCv,
  deleteCandidateCv,
} from "@/apis/cvBuilder"
import { ICandidateCv } from "@/types/cvBuilder"
import { CreateCvDialog } from "./components/CreateCvDialog"
import { DEFAULT_CV_CONTENT, DEFAULT_THEME_CONFIG } from "./constants/defaultCvData"

export default function CvBuilderDashboardPage() {
  const router = useRouter()
  const [cvList, setCvList] = useState<ICandidateCv[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    cvId: number | null
    title: string
  }>({
    open: false,
    cvId: null,
    title: "",
  })

  // Action Menu anchor state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [activeCvId, setActiveCvId] = useState<number | null>(null)

  const fetchCvs = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getMyCandidateCvs()
      if (res.data) {
        setCvList(res.data)
      }
    } catch (err: any) {
      console.error("Error fetching CVs:", err)
      setToast({
        open: true,
        message: err?.response?.data?.message || "Không thể tải danh sách CV.",
        severity: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCvs()
  }, [fetchCvs])

  const handleCreateCv = async (title: string, templateId: string) => {
    try {
      const res = await createCandidateCv({
        title,
        templateId,
        themeConfig: DEFAULT_THEME_CONFIG,
        content: DEFAULT_CV_CONTENT,
        isDefault: cvList.length === 0,
      })
      if (res.data) {
        setToast({ open: true, message: "Tạo CV mới thành công!", severity: "success" })
        router.push(`/candidate/cv-builder/${res.data.id}`)
      }
    } catch (err: any) {
      console.error("Error creating CV:", err)
      setToast({
        open: true,
        message: err?.response?.data?.message || "Không thể tạo CV mới.",
        severity: "error",
      })
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultCandidateCv(id)
      setToast({ open: true, message: "Đã đặt làm CV mặc định thành công!", severity: "success" })
      fetchCvs()
    } catch (err: any) {
      setToast({ open: true, message: "Không thể đặt làm mặc định.", severity: "error" })
    }
    handleCloseMenu()
  }

  const handleDuplicate = async (id: number) => {
    try {
      const res = await duplicateCandidateCv(id)
      if (res.data) {
        setToast({ open: true, message: "Nhân bản CV thành công!", severity: "success" })
        fetchCvs()
      }
    } catch (err: any) {
      setToast({ open: true, message: "Không thể nhân bản CV.", severity: "error" })
    }
    handleCloseMenu()
  }

  const handleOpenDeleteDialog = (id: number, title: string) => {
    handleCloseMenu()
    setDeleteDialog({ open: true, cvId: id, title })
  }

  const handleConfirmDelete = async () => {
    if (!deleteDialog.cvId) return
    try {
      await deleteCandidateCv(deleteDialog.cvId)
      setToast({ open: true, message: "Đã xóa bản CV thành công!", severity: "success" })
      fetchCvs()
    } catch (err: any) {
      setToast({ open: true, message: "Không thể xóa CV.", severity: "error" })
    } finally {
      setDeleteDialog({ open: false, cvId: null, title: "" })
    }
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchorEl(event.currentTarget)
    setActiveCvId(id)
  }

  const handleCloseMenu = () => {
    setMenuAnchorEl(null)
    setActiveCvId(null)
  }

  return (
    <Box>
      {/* Header Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="primary" gutterBottom>
            Interactive Resume Builder
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tạo & chỉnh sửa CV trực quan tiêu chuẩn ITJob. Xuất file PDF chất lượng cao ứng tuyển ngay!
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => setIsCreateOpen(true)}
          sx={{ fontWeight: 800, borderRadius: 2, px: 3 }}
        >
          Tạo CV Mới
        </Button>
      </Box>

      {/* CV List Grid */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress color="primary" />
        </Box>
      ) : cvList.length === 0 ? (
        /* Empty State */
        <Card sx={{ p: 6, textAlign: "center", borderRadius: 3, borderStyle: "dashed" }}>
          <Article sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Bạn chưa tạo bản CV Interactive nào
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3} maxWidth={500} mx="auto">
            Hãy bắt đầu tạo CV chuyên nghiệp đầu tiên với các mẫu giao diện được tối ưu hóa cho ngành IT.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsCreateOpen(true)}
            sx={{ fontWeight: 700 }}
          >
            Tạo CV Đầu Tiên Ngay
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {cvList.map((cv) => {
            const isDefaultCv = Boolean(cv.isDefault || (cv as any).default)
            return (
              <Grid item xs={12} sm={6} md={4} key={cv.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    position: "relative",
                    transition: "all 0.25s ease-in-out",
                    border: isDefaultCv ? "2px solid" : "1px solid",
                    borderColor: isDefaultCv ? "primary.main" : "grey.200",
                    bgcolor: isDefaultCv ? "rgba(237, 27, 47, 0.02)" : "background.paper",
                    boxShadow: isDefaultCv ? "0 8px 24px rgba(237, 27, 47, 0.15)" : 1,
                    "&:hover": {
                      boxShadow: isDefaultCv
                        ? "0 12px 28px rgba(237, 27, 47, 0.25)"
                        : "0 8px 20px rgba(0, 0, 0, 0.08)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        {isDefaultCv && (
                          <Chip
                            icon={<Star sx={{ fontSize: "16px !important", color: "#fff !important" }} />}
                            label="CV Mặc Định"
                            color="primary"
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: "11px",
                              boxShadow: "0 2px 8px rgba(237, 27, 47, 0.35)",
                            }}
                          />
                        )}
                        <Chip
                          label={cv.templateId || "modern-it"}
                          variant="outlined"
                          size="small"
                          sx={{ textTransform: "capitalize", fontSize: "11px" }}
                        />
                      </Box>
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, cv.id)}>
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Typography variant="h6" fontWeight={800} noWrap gutterBottom title={cv.title}>
                      {cv.title}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block">
                      Cập nhật lần cuối: {cv.updatedAt ? new Date(cv.updatedAt).toLocaleDateString("vi-VN") : "Gần đây"}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ px: 3, pb: 3, pt: 0, justifyContent: "space-between" }}>
                    <Button
                      variant={isDefaultCv ? "contained" : "outlined"}
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => router.push(`/candidate/cv-builder/${cv.id}`)}
                      sx={{ fontWeight: 700 }}
                    >
                      Chỉnh Sửa CV
                    </Button>
                    {cv.pdfUrl && (
                      <Tooltip title="Tải xuống PDF">
                        <IconButton
                          component="a"
                          href={cv.pdfUrl}
                          target="_blank"
                          size="small"
                          color="primary"
                        >
                          <PictureAsPdf />
                        </IconButton>
                      </Tooltip>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        {activeCvId
          ? [
              <MenuItem key="edit" onClick={() => router.push(`/candidate/cv-builder/${activeCvId}`)}>
                <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                <ListItemText>Chỉnh Sửa</ListItemText>
              </MenuItem>,
              <MenuItem key="duplicate" onClick={() => handleDuplicate(activeCvId)}>
                <ListItemIcon><FileCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Nhân Bản CV</ListItemText>
              </MenuItem>,
              !Boolean(
                cvList.find((c) => c.id === activeCvId)?.isDefault ||
                  (cvList.find((c) => c.id === activeCvId) as any)?.default
              ) && (
                <MenuItem key="set-default" onClick={() => handleSetDefault(activeCvId)}>
                  <ListItemIcon><StarBorder fontSize="small" color="primary" /></ListItemIcon>
                  <ListItemText sx={{ color: "primary.main", fontWeight: 700 }}>Đặt Làm Mặc Định</ListItemText>
                </MenuItem>
              ),
              <MenuItem
                key="delete"
                onClick={() => {
                  const target = cvList.find((c) => c.id === activeCvId)
                  if (target) handleOpenDeleteDialog(target.id, target.title)
                }}
                sx={{ color: "error.main" }}
              >
                <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Xóa CV</ListItemText>
              </MenuItem>,
            ].filter(Boolean)
          : []}
      </Menu>

      {/* Create CV Dialog */}
      <CreateCvDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateCv}
      />

      {/* Delete Confirmation MUI Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, cvId: null, title: "" })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <WarningAmber color="error" fontSize="medium" />
          <Typography variant="h6" fontWeight={800} color="error.main">
            Xác Nhận Xóa CV
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2" color="text.primary" sx={{ mt: 1 }}>
            Bạn có chắc chắn muốn xóa bản CV <strong>"{deleteDialog.title}"</strong> không? Hành động này sẽ xóa dữ liệu khỏi hệ thống và không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, cvId: null, title: "" })}
            color="inherit"
            variant="outlined"
          >
            Hủy Bỏ
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{ fontWeight: 700 }}
          >
            Xóa Vĩnh Viễn
          </Button>
        </DialogActions>
      </Dialog>

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
