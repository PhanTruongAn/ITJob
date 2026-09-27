"use client"
import React from "react"
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Card,
  CardContent,
} from "@mui/material"
import { ArrowUpward, ArrowDownward } from "@mui/icons-material"
import { ICvThemeConfig } from "@/types/cvBuilder"
import { COLOR_PALETTES, FONT_OPTIONS } from "../../constants/defaultCvData"

interface ThemeSettingsFormProps {
  config: ICvThemeConfig
  onChange: (config: ICvThemeConfig) => void
}

const SECTION_LABELS: Record<string, string> = {
  summary: "Tóm Tắt Bản Thân",
  skills: "Kỹ Năng Chuyên Môn",
  experience: "Kinh Nghiệm Làm Việc",
  projects: "Dự Án Tiêu Biểu",
  education: "Học Vấn",
  certificates: "Chứng Chỉ",
}

export const ThemeSettingsForm: React.FC<ThemeSettingsFormProps> = ({
  config,
  onChange,
}) => {
  const handleColorChange = (color: string) => {
    onChange({ ...config, primaryColor: color })
  }

  const handleFontChange = (font: string) => {
    onChange({ ...config, fontFamily: font })
  }

  const handleFontSizeChange = (size: "sm" | "md" | "lg") => {
    if (size) onChange({ ...config, fontSize: size })
  }

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const order = [...(config.sectionOrder || [])]
    const targetIdx = direction === "up" ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= order.length) return
    const temp = order[index]
    order[index] = order[targetIdx]
    order[targetIdx] = temp
    onChange({ ...config, sectionOrder: order })
  }

  return (
    <Box className="space-y-5 pt-2">
      {/* Primary Color Palette */}
      <div>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          Màu Chủ Đạo (Primary Color):
        </Typography>
        <Grid container spacing={1}>
          {COLOR_PALETTES.map((palette) => {
            const isSelected = config.primaryColor === palette.value
            return (
              <Grid item key={palette.value}>
                <Box
                  onClick={() => handleColorChange(palette.value)}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: palette.value,
                    cursor: "pointer",
                    border: "3px solid",
                    borderColor: isSelected ? "grey.900" : "transparent",
                    transition: "transform 0.15s ease",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                  title={palette.name}
                />
              </Grid>
            )
          })}
        </Grid>
      </div>

      {/* Font Family */}
      <div>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          Kiểu Chữ (Font Family):
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={config.fontFamily || FONT_OPTIONS[0].value}
            onChange={(e) => handleFontChange(e.target.value)}
          >
            {FONT_OPTIONS.map((f) => (
              <MenuItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Font Size */}
      <div>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          Cỡ Chữ (Font Size):
        </Typography>
        <ToggleButtonGroup
          fullWidth
          size="small"
          value={config.fontSize || "md"}
          exclusive
          onChange={(_, val) => handleFontSizeChange(val)}
        >
          <ToggleButton value="sm">Nhỏ (12px)</ToggleButton>
          <ToggleButton value="md">Vừa (13px)</ToggleButton>
          <ToggleButton value="lg">Lớn (15px)</ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Section Reordering */}
      <div>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          Sắp Xếp Thứ Tự Các Mục (Section Order):
        </Typography>
        <div className="space-y-1.5">
          {(config.sectionOrder || []).map((sectionKey, idx) => (
            <Card key={sectionKey} variant="outlined" sx={{ py: 0.5, px: 1.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <span className="text-xs font-semibold text-gray-700">
                  {idx + 1}. {SECTION_LABELS[sectionKey] || sectionKey}
                </span>
                <Box>
                  <IconButton
                    size="small"
                    disabled={idx === 0}
                    onClick={() => handleMoveSection(idx, "up")}
                  >
                    <ArrowUpward fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    disabled={idx === (config.sectionOrder?.length || 0) - 1}
                    onClick={() => handleMoveSection(idx, "down")}
                  >
                    <ArrowDownward fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))}
        </div>
      </div>
    </Box>
  )
}
