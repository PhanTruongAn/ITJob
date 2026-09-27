"use client"
import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material"
import { Close, CheckCircle } from "@mui/icons-material"
import { TEMPLATE_OPTIONS, DEFAULT_CV_CONTENT, DEFAULT_THEME_CONFIG } from "../constants/defaultCvData"

interface CreateCvDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (title: string, templateId: string) => Promise<void>
}

export const CreateCvDialog: React.FC<CreateCvDialogProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("CV Lập Trình Viên")
  const [selectedTemplate, setSelectedTemplate] = useState("modern-it")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return
    try {
      setIsSubmitting(true)
      await onCreate(title.trim(), selectedTemplate)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight={800} color="primary">
          Tạo CV Mới từ Template Chuyên Nghiệp
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box mb={3}>
          <TextField
            fullWidth
            label="Tên Hồ Sơ CV"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
              sx: { bgcolor: "background.paper", px: 0.6, borderRadius: 0.5, fontWeight: 600 },
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: CV Senior Fullstack Developer 2026"
            size="small"
            required
            helperText="Đặt tên dễ nhớ để phân biệt giữa các bản CV tuyển dụng khác nhau"
          />
        </Box>

        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Chọn Mẫu CV Phù Hợp Với Vị Trí Của Bạn:
        </Typography>

        <Grid container spacing={2}>
          {TEMPLATE_OPTIONS.map((tpl) => {
            const isSelected = selectedTemplate === tpl.id
            return (
              <Grid item xs={12} sm={4} key={tpl.id}>
                <Card
                  onClick={() => setSelectedTemplate(tpl.id)}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    border: "2px solid",
                    borderColor: isSelected ? "primary.main" : "grey.200",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: "primary.light",
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  {isSelected && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        bgcolor: "white",
                        borderRadius: "50%",
                        display: "flex",
                      }}
                    >
                      <CheckCircle color="primary" />
                    </Box>
                  )}
                  <CardMedia
                    component="img"
                    height="140"
                    image={tpl.thumbnail}
                    alt={tpl.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      {tpl.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mb: 1.5 }}>
                      {tpl.description}
                    </Typography>
                    <Chip
                      label={tpl.recommendedFor}
                      size="small"
                      color={isSelected ? "primary" : "default"}
                      variant={isSelected ? "filled" : "outlined"}
                      sx={{ fontSize: 10, height: 20 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Hủy Bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim() || isSubmitting}
          sx={{ fontWeight: 700 }}
        >
          {isSubmitting ? "Đang Tạo..." : "Tạo & Chỉnh Sửa Ngay"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
