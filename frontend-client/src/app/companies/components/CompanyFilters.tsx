"use client"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import CodeIcon from "@mui/icons-material/Code"
import PsychologyIcon from "@mui/icons-material/Psychology"
import { Box, Button, Container } from "@mui/material"
import { CompanyTypeEnum } from "@/apis/company/company.types"

interface CompanyFiltersProps {
  activeFilter: string
  onChangeFilter: (filter: string) => void
}

export default function CompanyFilters({
  activeFilter,
  onChangeFilter,
}: CompanyFiltersProps) {
  const filters = [
    { id: "all", label: "Tất cả", icon: null },
    { id: CompanyTypeEnum.IT_PRODUCT, label: "IT Product", icon: <CodeIcon fontSize="small" /> },
    { id: CompanyTypeEnum.IT_OUTSOURCING, label: "IT Outsourcing", icon: <AccountBalanceIcon fontSize="small" /> },
    { id: CompanyTypeEnum.IT_SERVICE_AND_CONSULTING, label: "IT Service & Consulting", icon: <PsychologyIcon fontSize="small" /> },
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
            onClick={() => onChangeFilter(filter.id)}
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
