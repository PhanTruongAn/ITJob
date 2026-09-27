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
} from "@mui/material"
import { Add, Delete } from "@mui/icons-material"
import { ICvEducation } from "@/types/cvBuilder"

interface EducationFormProps {
  data: ICvEducation[]
  onChange: (data: ICvEducation[]) => void
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

export const EducationForm: React.FC<EducationFormProps> = ({
  data,
  onChange,
}) => {
  const handleItemChange = (index: number, field: keyof ICvEducation, value: any) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const handleAdd = () => {
    const newItem: ICvEducation = {
      id: `edu-${Date.now()}`,
      school: "Đại Học / Trưởng Đào Tạo",
      degree: "Cử Nhân",
      field: "Công Nghệ Thông Tin",
      startDate: "2020",
      endDate: "2024",
      gpa: "3.5 / 4.0",
      description: "",
    }
    onChange([...data, newItem])
  }

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <Box className="space-y-4 pt-2">
      {data.map((edu, index) => (
        <Card key={edu.id || index} variant="outlined">
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <span className="font-bold text-xs text-gray-700">Học vấn #{index + 1}</span>
              <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Trường Học"
                  InputLabelProps={inputLabelProps}
                  value={edu.school || ""}
                  onChange={(e) => handleItemChange(index, "school", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Bằng Cấp / Học Vấn"
                  InputLabelProps={inputLabelProps}
                  value={edu.degree || ""}
                  onChange={(e) => handleItemChange(index, "degree", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Chuyên Ngành"
                  InputLabelProps={inputLabelProps}
                  value={edu.field || ""}
                  onChange={(e) => handleItemChange(index, "field", e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Năm Bắt Đầu"
                  InputLabelProps={inputLabelProps}
                  value={edu.startDate || ""}
                  onChange={(e) => handleItemChange(index, "startDate", e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Năm Tốt Nghiệp"
                  InputLabelProps={inputLabelProps}
                  value={edu.endDate || ""}
                  onChange={(e) => handleItemChange(index, "endDate", e.target.value)}
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
        Thêm Học Vấn
      </Button>
    </Box>
  )
}
