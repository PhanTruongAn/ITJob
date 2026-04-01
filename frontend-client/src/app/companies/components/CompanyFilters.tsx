"use client"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import CodeIcon from "@mui/icons-material/Code"
import PsychologyIcon from "@mui/icons-material/Psychology"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { Box, Button, Container, Stack } from "@mui/material"
import { useState } from "react"

export default function CompanyFilters() {
  const [activeFilter, setActiveFilter] = useState("all")

  const filters = [
    { id: "all", label: "Tất cả", icon: null },
    { id: "software", label: "Phát triển Phần mềm", icon: <CodeIcon fontSize="small" /> },
    { id: "fintech", label: "Tài chính", icon: <AccountBalanceIcon fontSize="small" /> },
    { id: "ai", label: "Trí tuệ Nhân tạo", icon: <PsychologyIcon fontSize="small" /> },
    { id: "ecommerce", label: "Thương mại điện tử", icon: <ShoppingCartIcon fontSize="small" /> },
  ]

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1200, px: { xs: 2, md: 3 }, py: 4 }}>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          pb: 1,
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "contained" : "outlined"}
            color={activeFilter === filter.id ? "primary" : "inherit"}
            startIcon={filter.icon}
            onClick={() => setActiveFilter(filter.id)}
            sx={{
              borderRadius: "50px",
              px: 3,
              py: 1,
              fontWeight: 500,
              textTransform: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              borderColor:
                activeFilter === filter.id
                  ? "primary.main"
                  : "divider",
              color:
                activeFilter === filter.id
                  ? "primary.contrastText"
                  : "text.primary",
              bgcolor:
                 activeFilter === filter.id
                   ? "primary.main"
                   : "background.paper",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor:
                   activeFilter === filter.id
                     ? "primary.dark"
                     : "background.paper",
              },
            }}
          >
            {filter.label}
          </Button>
        ))}
      </Box>
    </Container>
  )
}
