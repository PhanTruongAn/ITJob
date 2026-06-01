"use client"
import { Box, Tab, Tabs } from "@mui/material"

interface NotificationTabsProps {
  activeTab: string
  onChange: (value: string) => void
}

export default function NotificationTabs({
  activeTab,
  onChange,
}: NotificationTabsProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
      <Tabs
        value={activeTab}
        onChange={(_, val) => onChange(val)}
        sx={{
          minHeight: 0,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            minWidth: 0,
            px: 3,
            py: 1.5,
            color: "text.secondary",
            "&.Mui-selected": {
              color: "primary.main",
            },
          },
          "& .MuiTabs-indicator": {
            bgcolor: "primary.main",
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
        }}
      >
        <Tab value="all" label="All" />
        <Tab value="application" label="Application Updates" />
        <Tab value="alerts" label="Job Alerts" />
        <Tab value="system" label="System" />
      </Tabs>
    </Box>
  )
}
