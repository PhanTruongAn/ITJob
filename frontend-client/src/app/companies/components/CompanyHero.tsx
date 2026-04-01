"use client"
import BusinessIcon from "@mui/icons-material/Business"
import CategoryIcon from "@mui/icons-material/Category"
import SearchIcon from "@mui/icons-material/Search"
import {
  Box,
  Button,
  Container,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useState } from "react"

export default function CompanyHero() {
  const [keyword, setKeyword] = useState("")
  const [category, setCategory] = useState("")

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "grey.900" : "primary.main",
        pt: { 
          xs: "calc(80px + var(--template-frame-height, 0px))", 
          md: "calc(120px + var(--template-frame-height, 0px))" 
        },
        pb: { xs: 8, md: 10 },
        textAlign: "center",
        color: "primary.contrastText",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          fontWeight="900"
          gutterBottom
          sx={{ mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}
        >
          Khám phá Công ty Công nghệ Hàng đầu
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            color: (theme) => theme.palette.mode === 'dark' ? 'grey.300' : 'primary.light',
            mb: 6,
            fontWeight: 400,
            opacity: 0.9,
          }}
        >
          Tìm kiếm môi trường làm việc mơ ước và phù hợp với lộ trình sự nghiệp
          của bạn tại Việt Nam
        </Typography>

        {/* Search Bar Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 1,
            p: 1,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "grey.900" : "common.white",
            borderRadius: 3,
            boxShadow: 4,
            width: "100%",
          }}
        >
          {/* Keyword Input */}
          <TextField
            fullWidth
            placeholder="Tên công ty hoặc từ khóa..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            variant="outlined"
            size="medium"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                ),
                sx: { 
                  height: 56, 
                  "& fieldset": { border: "none" },
                  bgcolor: "transparent"
                },
              }
            }}
            sx={{ flex: 1 }}
          />
          
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: "1px",
              bgcolor: "divider",
              my: 1,
            }}
          />

          {/* Category Select */}
          <Select
            displayEmpty
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            variant="outlined"
            startAdornment={
               <InputAdornment position="start" sx={{ pl: 1 }}>
                  <CategoryIcon color="action" />
               </InputAdornment>
            }
            sx={{
              flex: 1,
              height: 56,
              "& fieldset": { border: "none" },
              bgcolor: "transparent",
            }}
          >
            <MenuItem value="">Tất cả ngành nghề</MenuItem>
            <MenuItem value="software">Phát triển Phần mềm</MenuItem>
            <MenuItem value="fintech">Tài chính Công nghệ</MenuItem>
            <MenuItem value="ai">Trí tuệ Nhân tạo</MenuItem>
            <MenuItem value="ecommerce">Thương mại điện tử</MenuItem>
          </Select>

          {/* Search Button */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SearchIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              height: 56,
              boxShadow: "none",
            }}
          >
            Tìm kiếm
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
