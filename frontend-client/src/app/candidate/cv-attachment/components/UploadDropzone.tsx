"use client"
import AddIcon from "@mui/icons-material/Add"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { Alert, Box, Button, CircularProgress, Paper, Typography } from "@mui/material"
import { useRef, useState } from "react"

interface UploadDropzoneProps {
  onFileUpload: (file: File) => Promise<void>
  isUploading?: boolean
}

export default function UploadDropzone({
  onFileUpload,
  isUploading = false,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

  const handleSelectClick = () => {
    if (isUploading) return
    inputRef.current?.click()
  }

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null)

    // Validate size <= 10MB
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage(`Dung lượng tệp tin "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB) vượt quá giới hạn tối đa 10MB.`)
      return
    }

    // Validate extension
    const ext = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase()
    if (!["pdf", "doc", "docx"].includes(ext)) {
      setErrorMessage("Định dạng file không hợp lệ. Chỉ chấp nhận tệp tin PDF, DOC hoặc DOCX.")
      return
    }

    onFileUpload(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      validateAndProcessFile(files[0])
    }
    // Reset input value to allow re-selecting the same file if needed
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (isUploading) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      validateAndProcessFile(files[0])
    }
  }

  return (
    <Box>
      <Paper
        elevation={0}
        onClick={handleSelectClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          p: 6,
          borderRadius: 3,
          border: "2px dashed",
          borderColor: isDragOver ? "primary.main" : "divider",
          bgcolor: isDragOver ? "action.hover" : "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          cursor: isUploading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "primary.light",
            "& .upload-icon-wrap": { transform: "scale(1.1)" },
          },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          hidden
        />
        <Box
          className="upload-icon-wrap"
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "primary.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
            transition: "transform 0.2s ease",
          }}
        >
          {isUploading ? (
            <CircularProgress size={30} color="primary" />
          ) : (
            <CloudUploadIcon sx={{ fontSize: 30, color: "primary.main" }} />
          )}
        </Box>
        <Typography
          variant="h6"
          fontWeight={700}
          color="text.primary"
          gutterBottom
        >
          {isUploading ? "Đang tải CV lên AWS S3..." : "Upload New CV"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Kéo thả tệp tin vào đây hoặc nhấp để chọn từ máy tính.
          <br />
          Hỗ trợ định dạng: <strong>PDF, DOC, DOCX</strong> (Dung lượng tối đa <strong>10MB</strong>).
        </Typography>
        <Button
          variant="contained"
          disabled={isUploading}
          startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
          onClick={(e) => {
            e.stopPropagation()
            handleSelectClick()
          }}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.2,
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          {isUploading ? "Đang xử lý..." : "Select File"}
        </Button>
      </Paper>

      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  )
}
