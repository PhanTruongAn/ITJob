"use client"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import Chip from "@mui/material/Chip"
import CircularProgress from "@mui/material/CircularProgress"
import PaymentsIcon from "@mui/icons-material/Payments"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import WorkIcon from "@mui/icons-material/Work"
import { useMemo, useState } from "react"
import { useJobs } from "@/apis/job/job.hooks"
import { useRouter } from "next/navigation"

interface CompanyJobsTabProps {
  companyId: number
}

export default function CompanyJobsTab({ companyId }: CompanyJobsTabProps) {
  const router = useRouter()
  const [sortBy, setSortBy] = useState("latest")
  const [page] = useState(1)

  const { data, isLoading } = useJobs({
    companyId,
    page,
    size: 20,
  })

  const jobs = data?.data?.result ?? []

  const sortedJobs = useMemo(() => {
    const list = [...jobs]
    if (sortBy === "salary") {
      list.sort((a, b) => (b.salary ?? 0) - (a.salary ?? 0))
    }
    return list
  }, [jobs, sortBy])

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value)
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
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
          {sortedJobs.length > 0 && (
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              fontWeight={400}
              ml={1}
            >
              ({sortedJobs.length} vị trí)
            </Typography>
          )}
        </Typography>

        {sortedJobs.length > 0 && (
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Sắp xếp theo:
            </Typography>
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                displayEmpty
                disableUnderline
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  color: "primary.main",
                  "& .MuiSelect-select": { py: 0.5, pr: "24px !important" },
                }}
              >
                <MenuItem value="latest">Mới nhất</MenuItem>
                <MenuItem value="salary">Lương cao nhất</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        )}
      </Box>

      {/* Jobs list */}
      {sortedJobs.length === 0 ? (
        <Box
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <WorkIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Hiện chưa có vị trí tuyển dụng nào.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2.5}>
          {sortedJobs.map((job) => (
            <Box
              key={job.id}
              onClick={() => router.push(`/jobs/${job.id}`)}
              sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 3,
                  borderColor: "primary.light",
                  "& .job-title": { color: "primary.main" },
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                gap={2}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="text.primary"
                    className="job-title"
                    sx={{ transition: "color 0.2s ease", mb: 1 }}
                  >
                    {job.name}
                  </Typography>

                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={{ xs: 1.5, sm: 3 }}
                    sx={{ mb: 2 }}
                  >
                    {job.salary != null && (
                      <Box display="flex" alignItems="center" gap={0.8}>
                        <PaymentsIcon
                          sx={{ color: "text.secondary", fontSize: 18 }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="success.main"
                        >
                          ${job.salary.toLocaleString()}
                        </Typography>
                      </Box>
                    )}

                    {job.location && (
                      <Box display="flex" alignItems="center" gap={0.8}>
                        <LocationOnIcon
                          sx={{ color: "text.secondary", fontSize: 18 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                    )}

                    {job.level && (
                      <Box display="flex" alignItems="center" gap={0.8}>
                        <WorkIcon
                          sx={{ color: "text.secondary", fontSize: 18 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {job.level}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Skills */}
                  {job.jobSkills && job.jobSkills.length > 0 && (
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {job.jobSkills.map((skill) => (
                        <Chip
                          key={skill.id}
                          label={skill.name}
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.05)"
                                : "grey.100",
                            color: "text.secondary",
                            border: "none",
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      {sortedJobs.length > 0 && (
        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push(`/jobs?companyId=${companyId}`)}
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
      )}
    </Box>
  )
}
