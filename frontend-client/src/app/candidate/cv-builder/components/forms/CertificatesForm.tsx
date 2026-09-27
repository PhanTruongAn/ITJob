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
import { ICvCertificate } from "@/types/cvBuilder"

interface CertificatesFormProps {
  data: ICvCertificate[]
  onChange: (data: ICvCertificate[]) => void
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

export const CertificatesForm: React.FC<CertificatesFormProps> = ({
  data,
  onChange,
}) => {
  const handleItemChange = (index: number, field: keyof ICvCertificate, value: any) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const handleAdd = () => {
    const newItem: ICvCertificate = {
      id: `cert-${Date.now()}`,
      name: "Tên Chứng Chỉ",
      organization: "Tổ Chức Cấp",
      issueDate: "2024",
      url: "",
    }
    onChange([...data, newItem])
  }

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <Box className="space-y-4 pt-2">
      {data.map((cert, index) => (
        <Card key={cert.id || index} variant="outlined">
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <span className="font-bold text-xs text-gray-700">Chứng chỉ #{index + 1}</span>
              <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tên Chứng Chỉ"
                  InputLabelProps={inputLabelProps}
                  value={cert.name || ""}
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tổ Chức Cấp"
                  InputLabelProps={inputLabelProps}
                  value={cert.organization || ""}
                  onChange={(e) => handleItemChange(index, "organization", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Năm Cấp"
                  InputLabelProps={inputLabelProps}
                  value={cert.issueDate || ""}
                  onChange={(e) => handleItemChange(index, "issueDate", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Link Xác Thực (Nếu có)"
                  InputLabelProps={inputLabelProps}
                  value={cert.url || ""}
                  onChange={(e) => handleItemChange(index, "url", e.target.value)}
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
        Thêm Chứng Chỉ
      </Button>
    </Box>
  )
}
