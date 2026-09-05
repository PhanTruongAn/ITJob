import { GlobalOutlined } from "@ant-design/icons"
import { Button, Dropdown, MenuProps } from "antd"
import React from "react"
import { useTranslation } from "react-i18next"

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.startsWith("en") ? "en" : "vi"

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    if (typeof window !== "undefined") {
      localStorage.setItem("itjob_lang", lng)
    }
  }

  const items: MenuProps["items"] = [
    {
      key: "vi",
      label: "🇻🇳 Tiếng Việt",
      onClick: () => changeLanguage("vi"),
    },
    {
      key: "en",
      label: "🇬🇧 English",
      onClick: () => changeLanguage("en"),
    },
  ]

  return (
    <Dropdown menu={{ items, selectedKeys: [currentLang] }} placement="bottomRight">
      <Button icon={<GlobalOutlined />}>
        {currentLang === "vi" ? "🇻🇳 VI" : "🇬🇧 EN"}
      </Button>
    </Dropdown>
  )
}

export default LanguageSwitcher
