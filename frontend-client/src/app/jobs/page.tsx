"use client"
import JobFiltersSidebar from "@/app/jobs/components/JobFilterSideBar"
import JobList from "@/app/jobs/components/JobList"
import JobSearchBar from "@/app/jobs/components/JobSearchBar"
import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import AppTheme from "@/shared-theme/AppTheme"
import { fetchJobs } from "@/apis/job"
import { getPublicSkills } from "@/apis/skill"
import { IJob, ISkill } from "@/types/backend"
import { Box, CssBaseline, Stack } from "@mui/material"
import { Container } from "@mui/system"
import { useCallback, useEffect, useState } from "react"

const PAGE_SIZE = 10

export interface JobFilters {
  keyword: string
  location: string
  selectedSkillIds: number[]
  selectedLevels: string[]
  selectedJobTypes: string[]
  minSalary?: number
  maxSalary?: number
  sortBy: string
  page: number
}

const defaultFilters: JobFilters = {
  keyword: "",
  location: "",
  selectedSkillIds: [],
  selectedLevels: [],
  selectedJobTypes: [],
  sortBy: "newest",
  page: 1,
}

export default function JobsPage() {
  const [skills, setSkills] = useState<ISkill[]>([])
  const [jobs, setJobs] = useState<IJob[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<JobFilters>(defaultFilters)

  // Load skills once on mount
  useEffect(() => {
    getPublicSkills().then((res) => {
      if (res?.data) setSkills(res.data)
    })
  }, [])

  // Fetch jobs when any filter changes
  const loadJobs = useCallback(async (f: JobFilters) => {
    setLoading(true)
    try {
      const res = await fetchJobs({
        name: f.keyword || undefined,
        location: f.location || undefined,
        level: f.selectedLevels.length === 1 ? f.selectedLevels[0] : undefined,
        levels: f.selectedLevels.length > 0 ? f.selectedLevels : undefined,
        jobType: f.selectedJobTypes.length === 1 ? f.selectedJobTypes[0] : undefined,
        jobTypes: f.selectedJobTypes.length > 0 ? f.selectedJobTypes : undefined,
        skillIds: f.selectedSkillIds.length > 0 ? f.selectedSkillIds : undefined,
        minSalary: f.minSalary,
        maxSalary: f.maxSalary,
        sortBy: f.sortBy !== "newest" ? f.sortBy : undefined,
        page: f.page,
        pageSize: PAGE_SIZE,
      })

      if (res?.data) {
        setJobs(res.data.result ?? [])
        setTotalPages(res.data.meta.pages ?? 1)
        setTotalElements(res.data.meta.total ?? 0)
      }
    } catch {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [])


  useEffect(() => {
    loadJobs(filters)
  }, [filters, loadJobs])

  const updateFilters = (partial: Partial<JobFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }))
  }

  const handleSearch = (keyword: string, location: string) => {
    setFilters((prev) => ({ ...prev, keyword, location, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }))
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: "center",
            pt: "calc(40px + var(--template-frame-height, 0px))",
            position: "relative",
            minHeight: "100vh",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "grey.950" : "rgb(243, 245, 247)",
          },
          (theme) => ({
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              zIndex: -1,
              inset: 0,
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, rgb(243, 245, 247), rgb(235, 238, 242))",
              backgroundRepeat: "no-repeat",
              ...theme.applyStyles("dark", {
                backgroundImage:
                  "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
              }),
            },
          }),
        ]}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1400, px: 3, py: 12 }}>
          <JobSearchBar onSearch={handleSearch} />
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={4}
            alignItems="flex-start"
          >
            <JobFiltersSidebar
              skills={skills}
              filters={filters}
              onFiltersChange={updateFilters}
              onClearFilters={handleClearFilters}
            />
            <JobList
              jobs={jobs}
              loading={loading}
              totalElements={totalElements}
              page={filters.page}
              totalPages={totalPages}
              sortBy={filters.sortBy}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
            />
          </Stack>
        </Container>
      </Stack>
      <Box sx={{ bgcolor: "background.paper" }}>
        <Footer />
      </Box>
    </AppTheme>
  )
}
