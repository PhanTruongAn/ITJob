"use client"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import PaymentsIcon from "@mui/icons-material/Payments"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import ScheduleIcon from "@mui/icons-material/Schedule"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import { useState } from "react"

interface Job {
  id: number
  title: string
  minSalary: number
  maxSalary: number
  location: string
  postedTime: string
  postedHoursAgo: number
  tags: string[]
}

const initialJobs: Job[] = [
  {
    id: 1,
    title: "Senior Java Developer",
    minSalary: 1500,
    maxSalary: 2800,
    location: "Hà Nội",
    postedTime: "2 giờ trước",
    postedHoursAgo: 2,
    tags: ["Java", "Spring Boot"],
  },
  {
    id: 2,
    title: "Frontend Engineer (React/TypeScript)",
    minSalary: 1200,
    maxSalary: 2200,
    location: "TP. Hồ Chí Minh",
    postedTime: "5 giờ trước",
    postedHoursAgo: 5,
    tags: ["ReactJS", "TypeScript"],
  },
]

export default function CompanyJobsTab() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [sortBy, setSortBy] = useState("latest")
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Record<number, boolean>>({})

  const handleSortChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSortBy(value)

    const sortedJobs = [...jobs]
    if (value === "latest") {
      sortedJobs.sort((a, b) => a.postedHoursAgo - b.postedHoursAgo)
    } else if (value === "salary") {
      sortedJobs.sort((a, b) => b.maxSalary - a.maxSalary)
    }
    setJobs(sortedJobs)
  }

  const toggleBookmark = (jobId: number) => {
    setBookmarkedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }))
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="800"
          sx={{ color: "primary.main", fontSize: "1.15rem" }}
        >
          Việc làm đang tuyển
        </Typography>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary">
            Sắp xếp theo:
          </Typography>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              displayEmpty
              disableUnderline
              sx={{
                fontSize: "0.875rem",
                fontWeight: "bold",
                color: "primary.main",
                cursor: "pointer",
                "& .MuiSelect-select": {
                  py: 0.5,
                  pr: "24px !important",
                },
              }}
            >
              <MenuItem value="latest">Mới nhất</MenuItem>
              <MenuItem value="salary">Lương cao nhất</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Jobs List */}
      <Stack spacing={2.5}>
        {jobs.map((job) => {
          const isBookmarked = !!bookmarkedJobs[job.id]
          return (
            <Box
              key={job.id}
              sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 1,
                transition: "all 0.3s ease",
                position: "relative",
                "&:hover": {
                  boxShadow: 3,
                  borderColor: "primary.light",
                  "& .job-title": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
                <Box sx={{ flexGrow: 1 }}>
                  {/* Job Title */}
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="text.primary"
                    className="job-title"
                    sx={{ transition: "color 0.2s ease", mb: 1, cursor: "pointer" }}
                  >
                    {job.title}
                  </Typography>

                  {/* Job Specs */}
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={{ xs: 1.5, sm: 3 }}
                    sx={{ mb: 2 }}
                  >
                    {/* Salary */}
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <PaymentsIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="success.main"
                      >
                        ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}
                      </Typography>
                    </Box>

                    {/* Location */}
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <LocationOnIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Box>

                    {/* Time */}
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <ScheduleIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.postedTime}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Skills/Tags */}
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    {job.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          borderRadius: 1.5,
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.05)"
                              : "grey.100",
                          color: "text.secondary",
                          border: "none",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Bookmark Button */}
                <IconButton
                  onClick={() => toggleBookmark(job.id)}
                  sx={{
                    color: isBookmarked ? "error.main" : "text.secondary",
                    "&:hover": {
                      color: isBookmarked ? "error.dark" : "error.light",
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Box>
            </Box>
          )
        })}
      </Stack>

      {/* View All Button */}
      <Button
        variant="outlined"
        fullWidth
        sx={{
          py: 1.5,
          fontWeight: "bold",
          borderRadius: 2.5,
          textTransform: "none",
          borderColor: "divider",
          color: "text.primary",
          "&:hover": {
            bgcolor: "action.hover",
            borderColor: "text.primary",
          },
        }}
      >
        Xem tất cả việc làm
      </Button>
    </Box>
  )
}
