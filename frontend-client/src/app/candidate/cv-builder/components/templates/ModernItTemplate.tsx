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

export const ModernItTemplate: React.FC<TemplateProps> = ({
  content,
  themeConfig,
}) => {
  const { personalInfo, summary, skills, experience, projects, education, certificates } = content
  const primaryColor = themeConfig.primaryColor || "#ed1b2f"

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        if (!summary) return null
        return (
          <div key="summary" className="mb-4">
            <h3
              className="font-bold uppercase tracking-wider mb-2 pb-1 border-b text-[1.05em] flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <Person style={{ fontSize: "1.2em" }} /> Tóm Tắt Bản Thân
            </h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-[0.95em]">
              {summary}
            </p>
          </div>
        )

      case "experience":
        if (!experience || experience.length === 0) return null
        return (
          <div key="experience" className="mb-4">
            <h3
              className="font-bold uppercase tracking-wider mb-3 pb-1 border-b text-[1.05em] flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <Work style={{ fontSize: "1.2em" }} /> Kinh Nghiệm Làm Việc
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-3 border-l-2" style={{ borderColor: `${primaryColor}60` }}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-[1em]">{exp.position}</h4>
                    <span className="text-[0.85em] text-gray-500 font-medium">
                      {exp.startDate} - {exp.isCurrent ? "Hiện tại" : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[0.9em] font-semibold" style={{ color: primaryColor }}>
                    {exp.company} {exp.location ? `• ${exp.location}` : ""}
                  </div>
                  <p className="text-gray-700 mt-1.5 whitespace-pre-line leading-relaxed text-[0.95em]">
                    {exp.description}
                  </p>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exp.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[0.85em] font-medium bg-gray-100 text-gray-700"
                        >
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
          <div key="projects" className="mb-4">
            <h3
              className="font-bold uppercase tracking-wider mb-3 pb-1 border-b text-[1.05em] flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <FolderSpecial style={{ fontSize: "1.2em" }} /> Dự Án Tiêu Biểu
            </h3>
            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-[1em]">{proj.name}</h4>
                    <span className="text-[0.85em] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                      {proj.role}
                    </span>
                  </div>
                  {(proj.demoUrl || proj.repoUrl) && (
                    <div className="flex gap-3 text-[0.85em] mt-1 text-gray-500">
                      {proj.demoUrl && <span>Demo: <a href={proj.demoUrl} className="underline" style={{ color: primaryColor }}>{proj.demoUrl}</a></span>}
                      {proj.repoUrl && <span>Github: <a href={proj.repoUrl} className="underline" style={{ color: primaryColor }}>{proj.repoUrl}</a></span>}
                    </div>
                  )}
                  <p className="text-gray-700 mt-1.5 whitespace-pre-line leading-relaxed text-[0.95em]">
                    {proj.description}
                  </p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[0.85em] bg-white border border-gray-200 text-gray-600">
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

      case "skills":
        if (!skills || skills.length === 0) return null
        return (
          <div key="skills" className="mb-4">
            <h3
              className="font-bold uppercase tracking-wider mb-2.5 pb-1 border-b text-[0.95em] flex items-center gap-1.5 text-gray-100"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              <Code style={{ fontSize: "1.2em" }} /> Kỹ Năng Chuyên Môn
            </h3>
            <div className="space-y-2.5">
              {skills.map((grp) => (
                <div key={grp.id}>
                  <div className="text-[0.9em] font-semibold text-gray-200 mb-1">
                    {grp.category}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {grp.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[0.85em] bg-white/15 text-white backdrop-blur-sm"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "education":
        if (!education || education.length === 0) return null
        return (
          <div key="education" className="mb-4">
            <h3
              className="font-bold uppercase tracking-wider mb-2 pb-1 border-b text-[0.95em] flex items-center gap-1.5 text-gray-100"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              <School style={{ fontSize: "1.2em" }} /> Học Vấn
            </h3>
            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="text-[0.9em] text-gray-200">
                  <div className="font-bold text-white">{edu.school}</div>
                  <div>{edu.degree} - {edu.field}</div>
                  <div className="text-gray-300 text-[0.85em]">{edu.startDate} - {edu.endDate} {edu.gpa ? `| GPA: ${edu.gpa}` : ""}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case "certificates":
        if (!certificates || certificates.length === 0) return null
        return (
          <div key="certificates" className="mb-4">
            <h3
              className="font-bold uppercase tracking-wider mb-2 pb-1 border-b text-[0.95em] flex items-center gap-1.5 text-gray-100"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              <CardMembership style={{ fontSize: "1.2em" }} /> Chứng Chỉ
            </h3>
            <div className="space-y-2">
              {certificates.map((cert) => (
                <div key={cert.id} className="text-[0.9em] text-gray-200">
                  <div className="font-semibold text-white">{cert.name}</div>
                  <div className="text-[0.85em] text-gray-300">{cert.organization} ({cert.issueDate})</div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Divide sections into Sidebar (skills, education, certificates) & Main (summary, experience, projects)
  const sidebarOrder = (themeConfig.sectionOrder || []).filter((s) =>
    ["skills", "education", "certificates"].includes(s)
  )
  const mainOrder = (themeConfig.sectionOrder || []).filter((s) =>
    ["summary", "experience", "projects"].includes(s)
  )

  return (
    <div className="flex h-full min-h-[297mm] text-gray-800 bg-white">
      {/* Sidebar Left */}
      <div
        className="w-[32%] p-6 text-white flex flex-col justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <div>
          {/* Avatar & Personal info */}
          <div className="text-center mb-6">
            {personalInfo.avatarUrl ? (
              <img
                src={personalInfo.avatarUrl}
                alt={personalInfo.fullName}
                className="w-24 h-24 rounded-full border-2 border-white/40 object-cover mx-auto mb-3 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white">
                {personalInfo.fullName ? personalInfo.fullName.charAt(0) : "CV"}
              </div>
            )}
            <h2 className="text-[1.4em] font-extrabold leading-tight text-white">
              {personalInfo.fullName}
            </h2>
            <p className="text-[0.85em] text-white/80 font-medium mt-1 uppercase tracking-wide">
              {personalInfo.jobTitle}
            </p>
          </div>

          {/* Contact Details */}
          <div className="mb-6 space-y-2 text-[0.85em] text-white/90 border-t border-b border-white/20 py-4">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Email style={{ fontSize: "1.1em" }} className="text-white/70" />
                <span className="truncate">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone style={{ fontSize: "1.1em" }} className="text-white/70" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.address && (
              <div className="flex items-center gap-2">
                <LocationOn style={{ fontSize: "1.1em" }} className="text-white/70" />
                <span>{personalInfo.address}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2">
                <GitHub style={{ fontSize: "1.1em" }} className="text-white/70" />
                <span className="truncate">{personalInfo.github.replace("https://", "")}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <LinkedIn style={{ fontSize: "1.1em" }} className="text-white/70" />
                <span className="truncate">{personalInfo.linkedin.replace("https://", "")}</span>
              </div>
            )}
            {personalInfo.portfolio && (
              <div className="flex items-center gap-2">
                <Language style={{ fontSize: "1.1em" }} className="text-white/70" />
                <span className="truncate">{personalInfo.portfolio.replace("https://", "")}</span>
              </div>
            )}
          </div>

          {/* Sidebar Sections */}
          {sidebarOrder.map((key) => renderSection(key))}
        </div>
      </div>

      {/* Main Right */}
      <div className="w-[68%] p-8 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-[1.8em] font-extrabold tracking-tight text-gray-900">
              {personalInfo.fullName}
            </h1>
            <p className="text-[1em] font-bold mt-1" style={{ color: primaryColor }}>
              {personalInfo.jobTitle}
            </p>
          </div>

          {/* Main Sections */}
          {mainOrder.map((key) => renderSection(key))}
        </div>
      </div>
    </div>
  )
}
