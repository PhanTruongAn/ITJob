"use client"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { useState } from "react"

const tabs = [
  { label: "Về chúng tôi", value: "about" },
  { label: "Việc làm", value: "jobs", count: 12 },
  { label: "Đánh giá", value: "reviews" },
]

interface CompanyNavTabsProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export default function CompanyNavTabs({
  activeTab = "about",
  onTabChange,
}: CompanyNavTabsProps) {
  const [current, setCurrent] = useState(activeTab)

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setCurrent(newValue)
    onTabChange?.(newValue)
  }

  return (
    <Box
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg">
        <Tabs
          value={current}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 600,
              fontSize: "0.9rem",
              textTransform: "none",
              px: 2,
              minHeight: 52,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {tab.label}
                  {tab.count !== undefined && (
                    <Box
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.2,
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        bgcolor: "action.selected",
                        color: "text.secondary",
                        lineHeight: 1.6,
                      }}
                    >
                      {tab.count}
                    </Box>
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Container>
    </Box>
  )
}
