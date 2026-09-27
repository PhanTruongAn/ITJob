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
import { ICvSkillGroup } from "@/types/cvBuilder"

interface SkillsFormProps {
  data: ICvSkillGroup[]
  onChange: (data: ICvSkillGroup[]) => void
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

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const handleItemChange = (index: number, field: keyof ICvSkillGroup, value: any) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const handleSkillsListChange = (index: number, skillsStr: string) => {
    const skillsList = skillsStr.split(",").map((s) => s.trim()).filter(Boolean)
    handleItemChange(index, "skills", skillsList)
  }

  const handleAdd = () => {
    const newItem: ICvSkillGroup = {
      id: `sk-${Date.now()}`,
      category: "Nhóm Kỹ Năng Mới",
      skills: ["Skill 1", "Skill 2"],
    }
    onChange([...data, newItem])
  }

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <Box className="space-y-4 pt-2">
      {data.map((group, index) => (
        <Card key={group.id || index} variant="outlined">
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <span className="font-bold text-xs text-gray-700">Nhóm kỹ năng #{index + 1}</span>
              <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tên Nhóm Kỹ Năng"
                  InputLabelProps={inputLabelProps}
                  value={group.category || ""}
                  onChange={(e) => handleItemChange(index, "category", e.target.value)}
                  placeholder="Backend, Frontend, DevOps..."
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                <TextField
                  fullWidth
                  size="small"
                  label="Danh Sách Kỹ Năng (Phân cách dấu phẩy)"
                  InputLabelProps={inputLabelProps}
                  value={(group.skills || []).join(", ")}
                  onChange={(e) => handleSkillsListChange(index, e.target.value)}
                  placeholder="Java, Spring Boot, PostgreSQL..."
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
        Thêm Nhóm Kỹ Năng
      </Button>
    </Box>
  )
}
