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
  Work,
  School,
  Code,
  FolderSpecial,
  CardMembership,
  Person,
} from "@mui/icons-material"

interface TemplateProps {
  content: ICvContent
  themeConfig: ICvThemeConfig
}

export const TechLeadTemplate: React.FC<TemplateProps> = ({
  content,
  themeConfig,
}) => {
  const { personalInfo, summary, skills, experience, projects, education, certificates } = content
  const primaryColor = themeConfig.primaryColor || "#0284c7"

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        if (!summary) return null
        return (
          <div key="summary" className="mb-5">
            <h3
              className="font-bold uppercase tracking-wider text-[0.95em] border-b-2 pb-1 mb-2 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <Person style={{ fontSize: "1.2em" }} /> Tóm Tắt Năng Lực Quản Lý & Kiến Trúc
            </h3>
            <p className="text-gray-700 text-[0.9em] whitespace-pre-line leading-relaxed">
              {summary}
            </p>
          </div>
        )

      case "experience":
        if (!experience || experience.length === 0) return null
        return (
          <div key="experience" className="mb-5">
            <h3
              className="font-bold uppercase tracking-wider text-[0.95em] border-b-2 pb-1 mb-3 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <Work style={{ fontSize: "1.2em" }} /> Kinh Nghiệm Quản Lý & Kỹ Thuật
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-gray-50/50 p-3 rounded border border-gray-100">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-900 text-[0.95em]">{exp.position}</h4>
                    <span className="text-[0.85em] font-semibold text-gray-500">
                      {exp.startDate} - {exp.isCurrent ? "Hiện tại" : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[0.9em] font-semibold mb-1.5" style={{ color: primaryColor }}>
                    {exp.company} {exp.location ? `• ${exp.location}` : ""}
                  </div>
                  <p className="text-gray-700 text-[0.9em] whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exp.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[0.8em] font-medium bg-white border border-gray-200 text-gray-700">
                          {tech}
                        </span>
                      ))}
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
              className="font-bold uppercase tracking-wider text-[0.95em] border-b-2 pb-1 mb-3 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <FolderSpecial style={{ fontSize: "1.2em" }} /> Dự Án Trọng Điểm & Tác Động
            </h3>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="border-l-2 pl-3" style={{ borderColor: primaryColor }}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-900 text-[0.95em]">{proj.name}</h4>
                    <span className="text-[0.85em] font-semibold text-gray-600">{proj.role}</span>
                  </div>
                  <p className="text-gray-700 text-[0.9em] mt-1 whitespace-pre-line leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )

      case "skills":
        if (!skills || skills.length === 0) return null
        return (
          <div key="skills" className="mb-5">
            <h3
              className="font-bold uppercase tracking-wider text-[0.95em] border-b-2 pb-1 mb-2 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <Code style={{ fontSize: "1.2em" }} /> Kỹ Năng Kỹ Thuật
            </h3>
            <div className="space-y-2">
              {skills.map((grp) => (
                <div key={grp.id}>
                  <div className="text-[0.85em] font-bold text-gray-800 uppercase tracking-wide">
                    {grp.category}
                  </div>
                  <div className="text-[0.9em] text-gray-600 leading-snug">
                    {grp.skills.join(", ")}
                  </div>
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
              className="font-bold uppercase tracking-wider text-[0.95em] border-b-2 pb-1 mb-2 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <School style={{ fontSize: "1.2em" }} /> Bằng Cấp Học Vấn
            </h3>
            <div className="space-y-2 text-[0.9em]">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-gray-900">{edu.school}</div>
                  <div className="text-gray-700">{edu.degree} - {edu.field}</div>
                  <div className="text-gray-500 text-[0.85em]">{edu.startDate} - {edu.endDate}</div>
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
              className="font-bold uppercase tracking-wider text-[0.95em] border-b-2 pb-1 mb-2 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <CardMembership style={{ fontSize: "1.2em" }} /> Chứng Chỉ Quốc Tế
            </h3>
            <div className="space-y-2 text-[0.9em]">
              {certificates.map((cert) => (
                <div key={cert.id}>
                  <div className="font-bold text-gray-900">{cert.name}</div>
                  <div className="text-gray-500 text-[0.85em]">{cert.organization} ({cert.issueDate})</div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const mainOrder = (themeConfig.sectionOrder || []).filter((s) =>
    ["summary", "experience", "projects"].includes(s)
  )
  const sidebarOrder = (themeConfig.sectionOrder || []).filter((s) =>
    ["skills", "education", "certificates"].includes(s)
  )

  return (
    <div className="h-full min-h-[297mm] text-gray-800 bg-white flex flex-col justify-between">
      <div>
        {/* Banner Header */}
        <div
          className="p-8 text-white flex justify-between items-center"
          style={{ backgroundColor: primaryColor }}
        >
          <div>
            <h1 className="text-[1.8em] font-extrabold tracking-tight">
              {personalInfo.fullName}
            </h1>
            <p className="text-[0.9em] uppercase tracking-widest font-semibold mt-1 text-white/90">
              {personalInfo.jobTitle}
            </p>
          </div>
          <div className="text-right space-y-1 text-[0.9em] text-white/90">
            {personalInfo.email && <div className="flex items-center justify-end gap-1"><Email style={{ fontSize: "1.1em" }} /> {personalInfo.email}</div>}
            {personalInfo.phone && <div className="flex items-center justify-end gap-1"><Phone style={{ fontSize: "1.1em" }} /> {personalInfo.phone}</div>}
            {personalInfo.address && <div className="flex items-center justify-end gap-1"><LocationOn style={{ fontSize: "1.1em" }} /> {personalInfo.address}</div>}
            {personalInfo.linkedin && <div className="flex items-center justify-end gap-1"><LinkedIn style={{ fontSize: "1.1em" }} /> {personalInfo.linkedin.replace("https://", "")}</div>}
          </div>
        </div>

        {/* 2-Column Body */}
        <div className="p-8 flex gap-8">
          {/* Main Left Column (65%) */}
          <div className="w-[65%]">
            {mainOrder.map((key) => renderSection(key))}
          </div>

          {/* Sidebar Right Column (35%) */}
          <div className="w-[35%] border-l pl-6 border-gray-200">
            {sidebarOrder.map((key) => renderSection(key))}
          </div>
        </div>
      </div>
    </div>
  )
}
