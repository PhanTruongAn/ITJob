"use client"
import React from "react"
import { ICvContent, ICvThemeConfig } from "@/types/cvBuilder"
import {
  Email,
  Phone,
  LocationOn,
  Language,
  GitHub,
  LinkedIn,
} from "@mui/icons-material"

interface TemplateProps {
  content: ICvContent
  themeConfig: ICvThemeConfig
}

export const MinimalCleanTemplate: React.FC<TemplateProps> = ({
  content,
  themeConfig,
}) => {
  const { personalInfo, summary, skills, experience, projects, education, certificates } = content
  const primaryColor = themeConfig.primaryColor || "#334155"

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        if (!summary) return null
        return (
          <div key="summary" className="mb-5">
            <h3
              className="font-bold uppercase tracking-wider text-[1em] border-b pb-1 mb-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              Tóm Tắt Bản Thân
            </h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-[0.95em]">
              {summary}
            </p>
          </div>
        )

      case "skills":
        if (!skills || skills.length === 0) return null
        return (
          <div key="skills" className="mb-5">
            <h3
              className="font-bold uppercase tracking-wider text-[1em] border-b pb-1 mb-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              Kỹ Năng Chuyên Môn
            </h3>
            <div className="space-y-1.5 text-[0.95em]">
              {skills.map((grp) => (
                <div key={grp.id} className="flex">
                  <span className="font-semibold text-gray-900 w-36 shrink-0">{grp.category}:</span>
                  <span className="text-gray-700">{grp.skills.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case "experience":
        if (!experience || experience.length === 0) return null
        return (
          <div key="experience" className="mb-5">
            <h3
              className="font-bold uppercase tracking-wider text-[1em] border-b pb-1 mb-3"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              Kinh Nghiệm Làm Việc
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-900 text-[1em]">
                      {exp.position} <span className="font-medium text-gray-600">| {exp.company}</span>
                    </h4>
                    <span className="text-[0.85em] text-gray-500 font-medium">
                      {exp.startDate} - {exp.isCurrent ? "Hiện tại" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-gray-700 text-[0.95em] mt-1 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="text-[0.85em] text-gray-500 mt-1">
                      <span className="font-semibold text-gray-700">Công nghệ: </span>
                      {exp.technologies.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case "projects":
        if (!projects || projects.length === 0) return null
        return (
          <div key="projects" className="mb-5">
            <h3
              className="font-bold uppercase tracking-wider text-[1em] border-b pb-1 mb-3"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              Dự Án Tiêu Biểu
            </h3>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-900 text-[1em]">
                      {proj.name} <span className="font-normal text-gray-600">({proj.role})</span>
                    </h4>
                    {proj.startDate && (
                      <span className="text-[0.85em] text-gray-500">
                        {proj.startDate} {proj.endDate ? `- ${proj.endDate}` : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-[0.95em] mt-1 whitespace-pre-line leading-relaxed">
                    {proj.description}
                  </p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[0.85em] text-gray-500 mt-1">
                      <span className="font-semibold text-gray-700">Công nghệ: </span>
                      {proj.technologies.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case "education":
        if (!education || education.length === 0) return null
        return (
          <div key="education" className="mb-5">
            <h3
              className="font-bold uppercase tracking-wider text-[1em] border-b pb-1 mb-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              Học Vấn
            </h3>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-[0.95em]">
                  <div>
                    <span className="font-bold text-gray-900">{edu.school}</span>
                    <span className="text-gray-600"> — {edu.degree} ({edu.field})</span>
                    {edu.gpa && <span className="text-gray-500"> | GPA: {edu.gpa}</span>}
                  </div>
                  <span className="text-[0.85em] text-gray-500">{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case "certificates":
        if (!certificates || certificates.length === 0) return null
        return (
          <div key="certificates" className="mb-5">
            <h3
              className="font-bold uppercase tracking-wider text-[1em] border-b pb-1 mb-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              Chứng Chỉ
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[0.95em]">
              {certificates.map((cert) => (
                <div key={cert.id}>
                  <span className="font-bold text-gray-900">{cert.name}</span>
                  <span className="text-gray-500"> ({cert.organization}, {cert.issueDate})</span>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const sectionOrder = themeConfig.sectionOrder || [
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certificates",
  ]

  return (
    <div className="p-8 h-full min-h-[297mm] text-gray-800 bg-white flex flex-col justify-between">
      <div>
        {/* Header Centered Minimalist */}
        <div className="text-center pb-6 mb-6 border-b border-gray-200">
          <h1 className="text-[1.8em] font-bold tracking-tight text-gray-900">
            {personalInfo.fullName}
          </h1>
          <p className="text-[0.9em] font-semibold uppercase tracking-widest mt-1" style={{ color: primaryColor }}>
            {personalInfo.jobTitle}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-3 text-[0.9em] text-gray-600">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Email style={{ fontSize: "1.1em" }} /> {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone style={{ fontSize: "1.1em" }} /> {personalInfo.phone}
              </span>
            )}
            {personalInfo.address && (
              <span className="flex items-center gap-1">
                <LocationOn style={{ fontSize: "1.1em" }} /> {personalInfo.address}
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <GitHub style={{ fontSize: "1.1em" }} /> {personalInfo.github.replace("https://", "")}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <LinkedIn style={{ fontSize: "1.1em" }} /> {personalInfo.linkedin.replace("https://", "")}
              </span>
            )}
            {personalInfo.portfolio && (
              <span className="flex items-center gap-1">
                <Language style={{ fontSize: "1.1em" }} /> {personalInfo.portfolio.replace("https://", "")}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Sections */}
        {sectionOrder.map((key) => renderSection(key))}
      </div>
    </div>
  )
}
