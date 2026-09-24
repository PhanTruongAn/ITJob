"use client"
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import { ISkill } from "@/types/backend"
import { JobFilters } from "../page"
import { useState } from "react"

const INITIAL_SKILL_COUNT = 8

const LEVELS = [
  { value: "INTERN", label: "Intern" },
  { value: "FRESHER", label: "Fresher" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MIDDLE", label: "Middle" },
  { value: "SENIOR", label: "Senior" },
]

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "CONTRACT", label: "Hợp đồng" },
  { value: "INTERNSHIP", label: "Thực tập" },
]

const SALARY_RANGES = [
  { label: "Dưới $1,000", min: undefined, max: 1000 },
  { label: "$1,000 - $2,500", min: 1000, max: 2500 },
  { label: "Trên $2,500", min: 2500, max: undefined },
]

interface JobFiltersSidebarProps {
  skills: ISkill[]
  filters: JobFilters
  onFiltersChange: (partial: Partial<JobFilters>) => void
  onClearFilters: () => void
}

export default function JobFiltersSidebar({
  skills,
  filters,
  onFiltersChange,
  onClearFilters,
}: JobFiltersSidebarProps) {
  const [showAllSkills, setShowAllSkills] = useState(false)

  const toggleItem = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]

  const handleSkillToggle = (id: number) => {
    onFiltersChange({
      selectedSkillIds: toggleItem(filters.selectedSkillIds, id),
    })
  }

  const handleLevelToggle = (value: string) => {
    onFiltersChange({
      selectedLevels: toggleItem(filters.selectedLevels, value),
    })
  }

  const handleJobTypeToggle = (value: string) => {
    onFiltersChange({
      selectedJobTypes: toggleItem(filters.selectedJobTypes, value),
    })
  }

  const handleSalaryChange = (value: string) => {
    const range = SALARY_RANGES.find((r) => r.label === value)
    if (range) {
      onFiltersChange({ minSalary: range.min, maxSalary: range.max })
    } else {
      onFiltersChange({ minSalary: undefined, maxSalary: undefined })
    }
  }

  const currentSalaryLabel =
    SALARY_RANGES.find(
      (r) => r.min === filters.minSalary && r.max === filters.maxSalary,
    )?.label ?? ""

  const visibleSkills = showAllSkills
    ? skills
    : skills.slice(0, INITIAL_SKILL_COUNT)
  const hasMoreSkills = skills.length > INITIAL_SKILL_COUNT

  return (
    <Stack spacing={4} sx={{ width: { xs: "100%", lg: 280 }, flexShrink: 0 }}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.900" : "common.white",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight="bold">Bộ lọc</Typography>
          <Button size="small" variant="text" color="primary" onClick={onClearFilters}>
            Xóa tất cả
          </Button>
        </Stack>

        {/* Skills - Dynamic from DB (compact chip layout) */}
        {skills.length > 0 && (
          <Box mb={3}>
            <Typography fontWeight="bold" mb={1}>
              Kỹ năng
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {visibleSkills.map((skill) => {
                const isSelected = filters.selectedSkillIds.includes(skill.id)
                return (
                  <Chip
                    key={skill.id}
                    label={skill.name}
                    size="small"
                    variant={isSelected ? "filled" : "outlined"}
                    color={isSelected ? "primary" : "default"}
                    onClick={() => handleSkillToggle(skill.id)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: isSelected ? 600 : 400,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: isSelected ? "primary.dark" : "action.hover",
                      },
                    }}
                  />
                )
              })}
            </Box>
            {hasMoreSkills && (
              <Button
                size="small"
                onClick={() => setShowAllSkills(!showAllSkills)}
                endIcon={showAllSkills ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ mt: 1, textTransform: "none", fontSize: 13 }}
              >
                {showAllSkills
                  ? "Thu gọn"
                  : `Hiển thị thêm (${skills.length - INITIAL_SKILL_COUNT})`}
              </Button>
            )}
          </Box>
        )}

        {/* Salary */}
        <Box mb={3}>
          <Typography fontWeight="bold" mb={1}>
            Mức lương
          </Typography>
          <RadioGroup
            value={currentSalaryLabel}
            onChange={(e) => handleSalaryChange(e.target.value)}
          >
            <FormControlLabel value="" control={<Radio size="small" />} label="Tất cả" />
            {SALARY_RANGES.map((r) => (
              <FormControlLabel
                key={r.label}
                value={r.label}
                control={<Radio size="small" />}
                label={r.label}
              />
            ))}
          </RadioGroup>
        </Box>

        {/* Job Type */}
        <Box mb={3}>
          <Typography fontWeight="bold" mb={1}>
            Loại hình
          </Typography>
          <Stack spacing={0.5}>
            {JOB_TYPES.map((type) => (
              <FormControlLabel
                key={type.value}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.selectedJobTypes.includes(type.value)}
                    onChange={() => handleJobTypeToggle(type.value)}
                  />
                }
                label={type.label}
              />
            ))}
          </Stack>
        </Box>

        {/* Level */}
        <Box mb={3}>
          <Typography fontWeight="bold" mb={1}>
            Cấp bậc
          </Typography>
          <Stack spacing={0.5}>
            {LEVELS.map((level) => (
              <FormControlLabel
                key={level.value}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.selectedLevels.includes(level.value)}
                    onChange={() => handleLevelToggle(level.value)}
                  />
                }
                label={level.label}
              />
            ))}
          </Stack>
        </Box>

        {/* Subscription */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "primary.light",
            color: "primary.main",
          }}
        >
          <Typography fontWeight="bold" mb={1}>
            Nhận thông báo việc làm
          </Typography>
          <Typography variant="body2" mb={2}>
            Chúng tôi sẽ gửi các việc làm phù hợp nhất vào email của bạn.
          </Typography>
          <TextField
            fullWidth
            placeholder="Email của bạn"
            size="small"
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" color="primary">
            Đăng ký ngay
          </Button>
        </Box>
      </Box>
    </Stack>
  )
}
