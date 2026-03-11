"use client"
import {
  Box,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material"
import JobCard, { JobCardProps } from "./JobCard"

interface JobListProps {
  jobs: JobCardProps[]
}

export default function JobList({ jobs }: JobListProps) {
  return (
    <Stack spacing={3} flex={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          {jobs.length} việc làm phù hợp
        </Typography>
        <Select size="small" value="newest">
          <MenuItem value="newest">Mới nhất</MenuItem>
          <MenuItem value="salary">Lương cao nhất</MenuItem>
        </Select>
      </Stack>

      {jobs.map((job, idx) => (
        <JobCard key={idx} {...job} />
      ))}

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination count={12} color="primary" />
      </Box>
    </Stack>
  )
}
