"use client"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import SearchIcon from "@mui/icons-material/Search"
import {
  Box,
  Button,
  Chip,
  InputBase,
  MenuItem,
  Select,
  Stack,
} from "@mui/material"
import { useState } from "react"

const suggestions = ["ReactJS", "Node.js", "Senior Java", "DevOps"]

export default function JobSearchBar() {
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")

  return (
    <Box
      sx={{
        p: 3,
        mb: 10,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "background.paper" : "common.white",
        boxShadow: 1,
      }}
    >
      <Stack spacing={2}>
        {/* Input Row */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Box sx={{ position: "relative", flex: 1 }}>
            <SearchIcon
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "text.secondary",
              }}
            />
            <InputBase
              placeholder="Tên công việc, kỹ năng, công ty..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              sx={{
                width: "100%",
                pl: 5,
                pr: 2,
                height: 56,
                borderRadius: 1,
                border: 1,
                borderColor: "divider",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                "& input::placeholder": { color: "text.disabled" },
              }}
            />
          </Box>

          <Box sx={{ position: "relative", width: { xs: "100%", md: 200 } }}>
            <LocationOnIcon
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "text.secondary",
              }}
            />
            <Select
              displayEmpty
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{
                width: "100%",
                pl: 5,
                height: 56,
                borderRadius: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                "& .MuiSelect-select": { py: 1.5 },
              }}
            >
              <MenuItem value="">Tất cả địa điểm</MenuItem>
              <MenuItem value="hcm">Hồ Chí Minh</MenuItem>
              <MenuItem value="hn">Hà Nội</MenuItem>
              <MenuItem value="dn">Đà Nẵng</MenuItem>
              <MenuItem value="remote">Remote</MenuItem>
            </Select>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            sx={{ height: 56, fontWeight: "bold" }}
          >
            Tìm kiếm
          </Button>
        </Stack>

        {/* Suggestions */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <Box
              sx={{
                fontSize: 12,
                fontWeight: 500,
                textTransform: "uppercase",
                color: "text.secondary",
              }}
            >
              Gợi ý:
            </Box>
          </Box>
          {suggestions.map((s) => (
            <Chip
              key={s}
              label={s}
              size="small"
              sx={{
                bgcolor: "primary.light",
                color: "primary.main",
                "&:hover": { bgcolor: "primary.lighter" },
                cursor: "pointer",
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}
