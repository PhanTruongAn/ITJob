"use client"

import LanguageIcon from "@mui/icons-material/Language"
import { Button, Menu, MenuItem } from "@mui/material"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    if (typeof window !== "undefined") {
      localStorage.setItem("itjob_lang", lng)
    }
    handleClose()
  }

  const currentLang = i18n.language?.startsWith("en") ? "en" : "vi"

  return (
    <div>
      <Button
        id="language-button"
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
        size="small"
        startIcon={<LanguageIcon fontSize="small" />}
        sx={{ minWidth: 80, textTransform: "uppercase", fontWeight: 600 }}
      >
        {currentLang === "vi" ? "🇻🇳 VI" : "🇬🇧 EN"}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "language-button",
        }}
      >
        <MenuItem
          onClick={() => changeLanguage("vi")}
          selected={currentLang === "vi"}
        >
          🇻🇳 Tiếng Việt
        </MenuItem>
        <MenuItem
          onClick={() => changeLanguage("en")}
          selected={currentLang === "en"}
        >
          🇬🇧 English
        </MenuItem>
      </Menu>
    </div>
  )
}
