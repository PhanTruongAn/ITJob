"use client"
import React from "react"
import { TextField, Box } from "@mui/material"

const inputLabelProps = {
  shrink: true,
  sx: {
    bgcolor: "background.paper",
    px: 0.6,
    borderRadius: 0.5,
    fontWeight: 600,
  },
}

interface SummaryFormProps {
  data: string
  onChange: (data: string) => void
}

export const SummaryForm: React.FC<SummaryFormProps> = ({ data, onChange }) => {
  return (
    <Box className="pt-2">
      <TextField
        fullWidth
        multiline
        rows={4}
        size="small"
        label="Tóm Tắt Mục Tiêu & Kinh Nghiệm Nổi Bật"
        InputLabelProps={inputLabelProps}
        value={data || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Viết 2-4 câu ngắn gọn tóm tắt kinh nghiệm chuyên môn, thế mạnh kỹ thuật và đóng góp chính của bạn..."
      />
    </Box>
  )
}
