"use client"
import AddIcon from "@mui/icons-material/Add"
import CheckIcon from "@mui/icons-material/Check"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DeleteIcon from "@mui/icons-material/Delete"
import DescriptionIcon from "@mui/icons-material/Description"
import DownloadIcon from "@mui/icons-material/Download"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import LightbulbIcon from "@mui/icons-material/Lightbulb"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { useRef } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface CVFile {
  id: number
  name: string
  type: "pdf" | "docx"
  uploadedAt: string
  size: string
  isDefault?: boolean
}

interface ActivityItem {
  id: number
  label: string
  time: string
  type: "view" | "upload" | "download"
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const cvFiles: CVFile[] = [
  {
    id: 1,
    name: "Senior_FE_Engineer_2024.pdf",
    type: "pdf",
    uploadedAt: "Oct 24, 2024",
    size: "1.2 MB",
    isDefault: true,
  },
  {
    id: 2,
    name: "Cloud_Architect_Profile.docx",
    type: "docx",
    uploadedAt: "Aug 12, 2024",
    size: "850 KB",
  },
  {
    id: 3,
    name: "General_IT_CV_V2.pdf",
    type: "pdf",
    uploadedAt: "Jan 05, 2024",
    size: "2.1 MB",
  },
]

const activityItems: ActivityItem[] = [
  { id: 1, label: "CV Viewed by Google", time: "2 hours ago", type: "view" },
  {
    id: 2,
    label: "New Upload: FE_2024.pdf",
    time: "Yesterday",
    type: "upload",
  },
  { id: 3, label: "CV Downloaded", time: "Oct 20, 2024", type: "download" },
]

// ─── Activity Icon ────────────────────────────────────────────────────────────

function ActivityDot({ type }: { type: ActivityItem["type"] }) {
  const config = {
    view: {
      bgcolor: "success.main",
      icon: <CheckIcon sx={{ fontSize: 10, color: "white" }} />,
    },
    upload: {
      bgcolor: "primary.main",
      icon: <FileUploadIcon sx={{ fontSize: 10, color: "white" }} />,
    },
    download: {
      bgcolor: "grey.300",
      icon: <FileDownloadIcon sx={{ fontSize: 10, color: "text.secondary" }} />,
    },
  }
  const { bgcolor, icon } = config[type]
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        bgcolor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        mt: 0.3,
      }}
    >
      {icon}
    </Box>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CVAttachmentPage() {
  const inputRef = useRef<HTMLInputElement>(null)

  const totalSlots = 5
  const usedSlots = cvFiles.length
  const usedPercent = (usedSlots / totalSlots) * 100

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
          Upload and manage multiple versions of your curriculum vitae. Keep
          your profile updated for the best job matching opportunities.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* ── Left Column (2/3) ─────────────────────────────────────────── */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            {/* Upload Dropzone */}
            <Paper
              elevation={0}
              onClick={() => inputRef.current?.click()}
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
                  inputRef.current?.click()
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

            {/* Managed Documents */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  color="primary.main"
                >
                  Managed Documents
                </Typography>
                <Chip
                  label={`${usedSlots} Total`}
                  size="small"
                  sx={{
                    bgcolor: "grey.100",
                    color: "text.secondary",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                />
              </Box>

              {/* File List */}
              <Stack divider={<Divider />}>
                {cvFiles.map((file) => (
                  <Box
                    key={file.id}
                    sx={{
                      px: 3,
                      py: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "background-color 0.15s ease",
                      "&:hover": {
                        bgcolor: (t) =>
                          t.palette.mode === "dark"
                            ? "rgba(255,255,255,0.07)"
                            : "grey.100",
                      },
                    }}
                  >
                    {/* Left: Icon + Info */}
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          bgcolor:
                            file.type === "pdf"
                              ? "error.light"
                              : "primary.light",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {file.type === "pdf" ? (
                          <PictureAsPdfIcon
                            sx={{ color: "error.main", fontSize: 20 }}
                          />
                        ) : (
                          <DescriptionIcon
                            sx={{ color: "primary.main", fontSize: 20 }}
                          />
                        )}
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.primary"
                        >
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Uploaded: {file.uploadedAt}&nbsp;&nbsp;•&nbsp;&nbsp;
                          {file.size}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right: Badge + Actions */}
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {file.isDefault && (
                        <Chip
                          label="Default"
                          size="small"
                          sx={{
                            bgcolor: "success.light",
                            color: "success.dark",
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            mr: 1,
                            borderRadius: 999,
                          }}
                        />
                      )}
                      <IconButton
                        size="small"
                        sx={{
                          color: "text.secondary",
                          "&:hover": { color: "primary.light" },
                        }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color: "text.secondary",
                          "&:hover": { color: "error.main" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* ── Right Column (1/3) ────────────────────────────────────────── */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Pro Tip */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "primary.main",
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative blob */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.08)",
                  filter: "blur(20px)",
                  pointerEvents: "none",
                }}
              />
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <LightbulbIcon
                  sx={{ fontSize: 32, color: "#bbf7d0", mb: 1.5 }}
                />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Pro Tip
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.7,
                    mb: 2,
                  }}
                >
                  Candidates with tailored CVs for specific roles have a{" "}
                  <Box
                    component="span"
                    sx={{ color: "#bbf7d0", fontWeight: 700 }}
                  >
                    45% higher
                  </Box>{" "}
                  chance of getting an interview.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(255,255,255,0.3)",
                    pb: 0.3,
                    cursor: "pointer",
                    "&:hover": { borderBottomColor: "white" },
                  }}
                >
                  Read more tips
                </Typography>
              </Box>
            </Paper>

            {/* Storage Status */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="primary.main"
                gutterBottom
              >
                Storage Status
              </Typography>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={0.8}>
                  <Typography variant="caption" color="text.secondary">
                    Used Capacity
                  </Typography>
                  <Typography variant="caption" fontWeight={700}>
                    {usedSlots} / {totalSlots} Files
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={usedPercent}
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: "grey.100",
                    "& .MuiLinearProgress-bar": { borderRadius: 999 },
                    mb: 2,
                  }}
                />
                <Box
                  display="flex"
                  alignItems="flex-start"
                  gap={1}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: (t) =>
                      t.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "grey.50",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: 16,
                      color: "primary.main",
                      mt: 0.2,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    lineHeight={1.6}
                  >
                    You can store up to 5 CVs. Delete older versions to make
                    space for new ones.
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Recent Activity */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="primary.main"
                sx={{ mb: 2.5 }}
              >
                Recent Activity
              </Typography>
              <Stack spacing={2.5}>
                {activityItems.map((item, idx) => (
                  <Box key={item.id} sx={{ position: "relative" }}>
                    {/* Connector line (not for last item) */}
                    {idx < activityItems.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: 9,
                          top: 22,
                          width: 2,
                          height: 28,
                          bgcolor: "divider",
                        }}
                      />
                    )}
                    <Box display="flex" gap={1.5}>
                      <ActivityDot type={item.type} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {item.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.time}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
