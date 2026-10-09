"use client"

import { IResume } from "@/types/backend"
import { Button, Stack } from "@mui/material"
import { useTranslation } from "react-i18next"

export type FilterTab = "all" | IResume["status"]

interface FilterTabBarProps {
  activeFilter: FilterTab
  setActiveFilter: (filter: FilterTab) => void
}

const filterTabs: { key: string; value: FilterTab }[] = [
  { key: "all", value: "all" },
  { key: "pending", value: "PENDING" },
  { key: "reviewing", value: "REVIEWING" },
  { key: "approved", value: "APPROVED" },
  { key: "rejected", value: "REJECTED" },
]

export default function FilterTabBar({ activeFilter, setActiveFilter }: FilterTabBarProps) {
  const { t } = useTranslation()

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
              ? { bgcolor: "primary.main", color: "white", borderColor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }
              : { bgcolor: "background.paper", color: "text.secondary", borderColor: "divider", "&:hover": { bgcolor: "grey.100", borderColor: "grey.300" } }),
          }}
        >
          {t(`myApplications.filters.${tab.key}`)}
        </Button>
      ))}
    </Stack>
  )
}
