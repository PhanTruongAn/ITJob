"use client"
import { AppStatus } from "@/app/candidate/commons/types"
import { Button, Stack } from "@mui/material"

export type FilterTab = "all" | AppStatus

interface FilterTabBarProps {
  activeFilter: FilterTab
  setActiveFilter: (filter: FilterTab) => void
}

const filterTabs: { label: string; value: FilterTab }[] = [
  { label: "All Jobs", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Interview", value: "interviewing" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Not Selected", value: "not_selected" },
]

export default function FilterTabBar({
  activeFilter,
  setActiveFilter,
}: FilterTabBarProps) {
  return (
    <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 3 }}>
      {filterTabs.map((tab) => (
        <Button
          key={tab.value}
          onClick={() => setActiveFilter(tab.value)}
          variant={activeFilter === tab.value ? "contained" : "outlined"}
          size="small"
          sx={{
            borderRadius: 999,
            fontWeight: 500,
            fontSize: "0.8rem",
            px: 2.5,
            py: 0.8,
            textTransform: "none",
            ...(activeFilter === tab.value
              ? {
                  bgcolor: "primary.main",
                  color: "white",
                  borderColor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }
              : {
                  bgcolor: "background.paper",
                  color: "text.secondary",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "grey.100", borderColor: "grey.300" },
                }),
          }}
        >
          {tab.label}
        </Button>
      ))}
    </Stack>
  )
}
