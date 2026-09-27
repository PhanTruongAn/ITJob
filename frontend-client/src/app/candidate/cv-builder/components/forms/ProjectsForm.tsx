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
import { ICvProject } from "@/types/cvBuilder"

interface ProjectsFormProps {
  data: ICvProject[]
  onChange: (data: ICvProject[]) => void
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

export const ProjectsForm: React.FC<ProjectsFormProps> = ({
  data,
  onChange,
}) => {
  const handleItemChange = (index: number, field: keyof ICvProject, value: any) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const handleTechChange = (index: number, techStr: string) => {
    const techs = techStr.split(",").map((t) => t.trim()).filter(Boolean)
    handleItemChange(index, "technologies", techs)
  }

  const handleAdd = () => {
    const newItem: ICvProject = {
      id: `proj-${Date.now()}`,
      name: "Tên Dự Án Mới",
      role: "Fullstack / Backend / Lead",
      demoUrl: "",
      repoUrl: "",
      startDate: "2024",
      endDate: "2025",
      description: "Mô tả mục tiêu dự án, quy mô người dùng và kết quả đạt được...",
      technologies: ["React", "Node.js"],
    }
    onChange([...data, newItem])
  }

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <Box className="space-y-4 pt-2">
      {data.map((proj, index) => (
        <Card key={proj.id || index} variant="outlined" sx={{ position: "relative" }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <span className="font-bold text-xs text-gray-700">Dự án #{index + 1}</span>
              <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tên Dự Án"
                  InputLabelProps={inputLabelProps}
                  value={proj.name || ""}
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Vai Trò Trong Dự Án"
                  InputLabelProps={inputLabelProps}
                  value={proj.role || ""}
                  onChange={(e) => handleItemChange(index, "role", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Link Demo"
                  InputLabelProps={inputLabelProps}
                  value={proj.demoUrl || ""}
                  onChange={(e) => handleItemChange(index, "demoUrl", e.target.value)}
                  placeholder="https://demo.example.com"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Link Repository GitHub"
                  InputLabelProps={inputLabelProps}
                  value={proj.repoUrl || ""}
                  onChange={(e) => handleItemChange(index, "repoUrl", e.target.value)}
                  placeholder="https://github.com/..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2.5}
                  size="small"
                  label="Mô Tả Chi Tiết Dự Án"
                  InputLabelProps={inputLabelProps}
                  value={proj.description || ""}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Công Nghệ (Phân cách bằng dấu phẩy)"
                  InputLabelProps={inputLabelProps}
                  value={(proj.technologies || []).join(", ")}
                  onChange={(e) => handleTechChange(index, e.target.value)}
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
        Thêm Dự Án Tiêu Biểu
      </Button>
    </Box>
  )
}
