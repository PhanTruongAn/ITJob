"use client"
import { getJobLatest } from "@/apis/job"
import { formatVNCurency } from "@/common/utils/formatCurrency"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PaymentsIcon from "@mui/icons-material/Payments"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import Chip from "@mui/material/Chip"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useQuery } from "@tanstack/react-query"

export default function HotJobs() {
  const { data, isLoading } = useQuery({
    queryKey: ["jobs", "hot"],
    queryFn: () => getJobLatest(),
  })

  const jobs = data?.data || [
    {
      id: 1,
      name: "Senior Java Developer",
      location: "Hà Nội",
      salary: 2500,
      company: { name: "FPT Software" },
      skills: ["Java", "Spring Boot"],
    },
    {
      id: 2,
      name: "ReactJS Lead",
      location: "Hồ Chí Minh",
      salary: 3000,
      company: { name: "VNG Corporation" },
      skills: ["React", "TypeScript"],
    },
    {
      id: 3,
      name: "QC Engineer (Manual/Auto)",
      location: "Đà Nẵng",
      salary: 1500,
      company: { name: "NAB" },
      skills: ["Testing", "Selenium"],
    },
  ]
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom sx={{ mb: 4 }}>
          Việc làm &quot;Chất&quot; nhất
        </Typography>
        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={i}>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
              ))
            : jobs.map((job: any) => (
                <Grid size={{ xs: 12, md: 4 }} key={job.id}>
                  <Card
                    sx={{
                      p: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {job.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      {job.companyName || "Công ty ẩn danh"}
                    </Typography>
                    <Stack spacing={1} sx={{ mt: "auto" }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        color="text.secondary"
                      >
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="body2">{job.location}</Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        color="success.main"
                      >
                        <PaymentsIcon fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {job.salary
                            ? `${formatVNCurency(job.salary)}`
                            : "Thỏa thuận"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {job.skills?.slice(0, 3).map((skill: any) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  )
}
