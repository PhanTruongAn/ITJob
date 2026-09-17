"use client"
import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import DeleteIcon from "@mui/icons-material/Delete"
import DescriptionIcon from "@mui/icons-material/Description"
import DownloadIcon from "@mui/icons-material/Download"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import { IFile } from "@/types/backend"

interface ManagedDocumentsProps {
  files: IFile[]
  onSetDefault: (id: number) => void
  onDelete: (id: number) => void
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 KB"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A"
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

export default function ManagedDocuments({
  files,
  onSetDefault,
  onDelete,
}: ManagedDocumentsProps) {
  return (
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
          label={`${files.length} Total`}
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

      {/* Empty State */}
      {files.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Chưa có tệp CV nào được tải lên. Hãy chọn tệp tin và upload CV của bạn!
          </Typography>
        </Box>
      ) : (
        /* File List */
        <Stack divider={<Divider />}>
          {files.map((file) => {
            const isPdf = file.fileExtension?.toLowerCase() === "pdf" || file.fileType?.includes("pdf")
            return (
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
                      bgcolor: isPdf ? "error.light" : "primary.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isPdf ? (
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
                      {file.fileName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Uploaded: {formatDate(file.createdAt)}&nbsp;&nbsp;•&nbsp;&nbsp;
                      {formatFileSize(file.fileSize)}
                    </Typography>
                  </Box>
                </Box>

                {/* Right: Badge + Actions */}
                <Box display="flex" alignItems="center" gap={0.5}>
                  {file.isDefault ? (
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
                  ) : (
                    <Tooltip title="Đặt làm CV mặc định">
                      <Button
                        size="small"
                        startIcon={<StarBorderIcon fontSize="small" />}
                        onClick={() => onSetDefault(file.id)}
                        sx={{
                          fontSize: "0.75rem",
                          textTransform: "none",
                          mr: 1,
                          color: "text.secondary",
                          "&:hover": { color: "warning.main" },
                        }}
                      >
                        Set Default
                      </Button>
                    </Tooltip>
                  )}

                  <Tooltip title="Tải xuống / Xem CV">
                    <IconButton
                      size="small"
                      component="a"
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "text.secondary",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Xóa CV này">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(file.id)}
                      sx={{
                        color: "text.secondary",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )
          })}
        </Stack>
      )}
    </Paper>
  )
}
