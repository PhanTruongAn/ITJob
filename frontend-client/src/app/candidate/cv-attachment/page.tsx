"use client"
import { Box, Grid, Stack, Typography } from "@mui/material"
import { useRef } from "react"
import ManagedDocuments, { CVFile } from "./components/ManagedDocuments"
import ProTipCard from "./components/ProTipCard"
import RecentActivityTimeline, {
  ActivityItem,
} from "./components/RecentActivityTimeline"
import StorageStatus from "./components/StorageStatus"
import UploadDropzone from "./components/UploadDropzone"

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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CVAttachmentPage() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelectClick = () => {
    inputRef.current?.click()
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
          Upload and manage multiple versions of your curriculum vitae. Keep
          your profile updated for the best job matching opportunities.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* ── Left Column (2/3) ─────────────────────────────────────────── */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            {/* Upload Dropzone */}
            <UploadDropzone
              inputRef={inputRef}
              onSelectClick={handleSelectClick}
            />

            {/* Managed Documents */}
            <ManagedDocuments files={cvFiles} />
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
    </Box>
  )
}
