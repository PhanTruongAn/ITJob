"use client"
import {
  Box,
  CircularProgress,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material"
import { IJob } from "@/types/backend"
import JobCard from "./JobCard"

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return ""
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes} phút trước`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} giờ trước`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} ngày trước`
    const months = Math.floor(days / 30)
    return `${months} tháng trước`
  } catch {
    return ""
  }
}

interface JobListProps {
  jobs: IJob[]
  loading: boolean
  totalElements: number
  page: number
  totalPages: number
  sortBy: string
  onPageChange: (page: number) => void
  onSortChange: (sortBy: string) => void
}

export default function JobList({
  jobs,
  loading,
  totalElements,
  page,
  totalPages,
  sortBy,
  onPageChange,
  onSortChange,
}: JobListProps) {
  return (
    <Stack spacing={3} flex={1} minWidth={0}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          {loading ? "Đang tải..." : `${totalElements} việc làm phù hợp`}
        </Typography>
        <Select
          size="small"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          disabled={loading}
        >
          <MenuItem value="newest">Mới nhất</MenuItem>
          <MenuItem value="salary_desc">Lương cao nhất</MenuItem>
          <MenuItem value="salary_asc">Lương thấp nhất</MenuItem>
        </Select>
      </Stack>

      <Box
        sx={{
          position: "relative",
          minHeight: 400,
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 150,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {jobs.length === 0 && !loading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={10}
          >
            <Typography variant="h6" color="text.secondary" mb={1}>
              Không tìm thấy việc làm phù hợp
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.name}
                company={job.companyName ?? ""}
                companyLogo={job.companyLogo}
                salary={
                  job.salary ? `$${job.salary.toLocaleString()}` : "Thỏa thuận"
                }
                location={job.location ?? ""}
                timeAgo={formatTimeAgo(job.startDate)}
                tags={job.jobSkills?.map((js) => js.skillName) ?? []}
                jobType={job.jobType}
                level={job.level}
              />
            ))}
          </Stack>
        )}
      </Box>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            color="primary"
            disabled={loading}
            onChange={(_, value) => onPageChange(value)}
          />
        </Box>
      )}
    </Stack>
  )
}
