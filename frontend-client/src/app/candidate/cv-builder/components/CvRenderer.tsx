"use client"
import React from "react"
import { ICvContent, ICvThemeConfig } from "@/types/cvBuilder"
import { ModernItTemplate } from "./templates/ModernItTemplate"
import { MinimalCleanTemplate } from "./templates/MinimalCleanTemplate"
import { TechLeadTemplate } from "./templates/TechLeadTemplate"

interface CvRendererProps {
  content: ICvContent
  themeConfig: ICvThemeConfig
  templateId?: string
  scale?: number
}

export const CvRenderer: React.FC<CvRendererProps> = ({
  content,
  themeConfig,
  templateId = "modern-it",
  scale = 1,
}) => {
  const getFontSizePx = (fontSize?: string) => {
    switch (fontSize) {
      case "sm":
        return "11.5px"
      case "lg":
        return "15px"
      case "md":
      default:
        return "13px"
    }
  }

  const renderTemplate = () => {
    switch (templateId) {
      case "minimal-clean":
        return <MinimalCleanTemplate content={content} themeConfig={themeConfig} />
      case "tech-lead":
        return <TechLeadTemplate content={content} themeConfig={themeConfig} />
      case "modern-it":
      default:
        return <ModernItTemplate content={content} themeConfig={themeConfig} />
    }
  }

  return (
    <div className="flex justify-center items-start overflow-auto p-4 sm:p-8 bg-gray-200/60 dark:bg-gray-950/80 min-h-screen">
      <div
        id="cv-a4-canvas"
        className="w-[210mm] min-h-[297mm] bg-white shadow-2xl transition-all duration-300"
        style={{
          fontFamily: themeConfig.fontFamily || "Inter, sans-serif",
          fontSize: getFontSizePx(themeConfig.fontSize),
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top center",
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  )
}
