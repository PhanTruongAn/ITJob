"use client"
import React from "react"
import { TextField, Grid, Box } from "@mui/material"
import { ICvPersonalInfo } from "@/types/cvBuilder"

interface PersonalInfoFormProps {
  data: ICvPersonalInfo
  onChange: (data: ICvPersonalInfo) => void
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

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  onChange,
}) => {
  const handleChange = (field: keyof ICvPersonalInfo, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <Box className="space-y-3 pt-2">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Họ và Tên"
            InputLabelProps={inputLabelProps}
            value={data.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Vị Trí Công Việc (Job Title)"
            InputLabelProps={inputLabelProps}
            value={data.jobTitle || ""}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Email"
            type="email"
            InputLabelProps={inputLabelProps}
            value={data.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Số Điện Thoại"
            InputLabelProps={inputLabelProps}
            value={data.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            label="Địa Chỉ / Thành Phố"
            InputLabelProps={inputLabelProps}
            value={data.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Link GitHub"
            InputLabelProps={inputLabelProps}
            value={data.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="https://github.com/username"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Link LinkedIn"
            InputLabelProps={inputLabelProps}
            value={data.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            label="Website Portfolio"
            InputLabelProps={inputLabelProps}
            value={data.portfolio || ""}
            onChange={(e) => handleChange("portfolio", e.target.value)}
            placeholder="https://mywebsite.dev"
          />
        </Grid>
      </Grid>
    </Box>
  )
}
