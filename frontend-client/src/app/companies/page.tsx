"use client"

import AppAppBar from "@/components/AppAppBar"
import Background from "@/components/background/BackGround"
import AppTheme from "@/shared-theme/AppTheme"
import { CssBaseline } from "@mui/material"

export default function CompaniesPage() {
  return (
    <AppTheme>
      <CssBaseline />
      <AppAppBar />
      <Background>
        <div>Companies</div>
      </Background>
    </AppTheme>
  )
}
