"use client"
import React from "react"
import {
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { Add, Delete } from "@mui/icons-material"
import { ICvExperience } from "@/types/cvBuilder"

interface ExperienceFormProps {
  data: ICvExperience[]
  onChange: (data: ICvExperience[]) => void
}

const inputLabelProps = {
  shrink: true,
  sx: {
    bgcolor: "background.paper",
    px: 0.6,
    borderRadius: 0.5,
    fontWeight: 600,
  },
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  data,
  onChange,
}) => {
  const handleItemChange = (index: number, field: keyof ICvExperience, value: any) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const handleTechChange = (index: number, techStr: string) => {
    const techs = techStr.split(",").map((t) => t.trim()).filter(Boolean)
    handleItemChange(index, "technologies", techs)
  }

  const handleAdd = () => {
    const newItem: ICvExperience = {
      id: `exp-${Date.now()}`,
      company: "Tên Công Ty / Doanh Nghiệp",
      position: "Vị Trí Công Việc",
      location: "Thành Phố",
      startDate: "01/2024",
      endDate: "Hiện tại",
      isCurrent: true,
      description: "• Mô tả các công việc và thành tựu nổi bật...",
      technologies: ["Java", "React"],
    }
    onChange([...data, newItem])
  }

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <Box className="space-y-4 pt-2">
      {data.map((exp, index) => (
        <Card key={exp.id || index} variant="outlined" sx={{ position: "relative" }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <span className="font-bold text-xs text-gray-700">Kinh nghiệm #{index + 1}</span>
              <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Vị Trí / Chức Danh"
                  InputLabelProps={inputLabelProps}
                  value={exp.position || ""}
                  onChange={(e) => handleItemChange(index, "position", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tên Công Ty"
                  InputLabelProps={inputLabelProps}
                  value={exp.company || ""}
                  onChange={(e) => handleItemChange(index, "company", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Địa Điểm"
                  InputLabelProps={inputLabelProps}
                  value={exp.location || ""}
                  onChange={(e) => handleItemChange(index, "location", e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Bắt Đầu"
                  InputLabelProps={inputLabelProps}
                  value={exp.startDate || ""}
                  onChange={(e) => handleItemChange(index, "startDate", e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Kết Thúc"
                  InputLabelProps={inputLabelProps}
                  disabled={exp.isCurrent}
                  value={exp.isCurrent ? "Hiện tại" : exp.endDate || ""}
                  onChange={(e) => handleItemChange(index, "endDate", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!exp.isCurrent}
                      onChange={(e) => handleItemChange(index, "isCurrent", e.target.checked)}
                      size="small"
                    />
                  }
                  label={<span className="text-xs text-gray-600">Đang làm việc tại đây</span>}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  label="Mô Tả Công Việc & Đóng Góp"
                  InputLabelProps={inputLabelProps}
                  value={exp.description || ""}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Công Nghệ Sử Dụng (Phân cách bằng dấu phẩy)"
                  InputLabelProps={inputLabelProps}
                  value={(exp.technologies || []).join(", ")}
                  onChange={(e) => handleTechChange(index, e.target.value)}
                  placeholder="Java, Spring Boot, React, Docker..."
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button
        fullWidth
        variant="outlined"
        startIcon={<Add />}
        onClick={handleAdd}
        sx={{ borderStyle: "dashed" }}
      >
        Thêm Kinh Nghiệm Làm Việc
      </Button>
    </Box>
  )
}
