"use client"
import DeleteIcon from "@mui/icons-material/Delete"
import DescriptionIcon from "@mui/icons-material/Description"
import DownloadIcon from "@mui/icons-material/Download"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material"

export interface CVFile {
  id: number
  name: string
  type: "pdf" | "docx"
  uploadedAt: string
  size: string
  isDefault?: boolean
}

interface ManagedDocumentsProps {
  files: CVFile[]
}

export default function ManagedDocuments({ files }: ManagedDocumentsProps) {
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

      {/* File List */}
      <Stack divider={<Divider />}>
        {files.map((file) => (
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
                    file.type === "pdf" ? "error.light" : "primary.light",
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
  )
}
