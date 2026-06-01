"use client"
import AddIcon from "@mui/icons-material/Add"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { Box, Button, Paper, Typography } from "@mui/material"
import { RefObject } from "react"

interface UploadDropzoneProps {
  inputRef: React.RefObject<HTMLInputElement>
  onSelectClick: () => void
}

export default function UploadDropzone({
  inputRef,
  onSelectClick,
}: UploadDropzoneProps) {
  return (
    <Paper
      elevation={0}
      onClick={onSelectClick}
      sx={{
        p: 6,
        borderRadius: 3,
        border: "2px dashed",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        cursor: "pointer",
        transition: "border-color 0.2s ease",
        "&:hover": {
          borderColor: "primary.light",
          "& .upload-icon-wrap": { transform: "scale(1.1)" },
        },
      }}
    >
      <input ref={inputRef} type="file" accept=".pdf,.docx" hidden />
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
        <CloudUploadIcon sx={{ fontSize: 30, color: "primary.main" }} />
      </Box>
      <Typography
        variant="h6"
        fontWeight={700}
        color="text.primary"
        gutterBottom
      >
        Upload New CV
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Drag and drop your file here or click to browse.
        <br />
        Supports PDF, DOCX (Max 5MB).
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={(e) => {
          e.stopPropagation()
          onSelectClick()
        }}
        sx={{
          borderRadius: 2,
          px: 3,
          py: 1.2,
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        Select File
      </Button>
    </Paper>
  )
}
