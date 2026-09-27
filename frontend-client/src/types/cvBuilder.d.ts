export interface ICvThemeConfig {
  primaryColor: string
  fontFamily: string
  fontSize: "sm" | "md" | "lg"
  sectionSpacing: "compact" | "normal" | "spacious"
  sectionOrder: string[]
}

export interface ICvPersonalInfo {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  address: string
  avatarUrl?: string
  github?: string
  linkedin?: string
  portfolio?: string
}

export interface ICvSkillGroup {
  id: string
  category: string
  skills: string[]
}

export interface ICvExperience {
  id: string
  company: string
  position: string
  location?: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
  technologies?: string[]
}

export interface ICvProject {
  id: string
  name: string
  role: string
  demoUrl?: string
  repoUrl?: string
  startDate?: string
  endDate?: string
  description: string
  technologies?: string[]
}

export interface ICvEducation {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
}

export interface ICvCertificate {
  id: string
  name: string
  organization: string
  issueDate: string
  url?: string
}

export interface ICvContent {
  personalInfo: ICvPersonalInfo
  summary: string
  skills: ICvSkillGroup[]
  experience: ICvExperience[]
  projects: ICvProject[]
  education: ICvEducation[]
  certificates: ICvCertificate[]
}

export interface ICandidateCv {
  id: number
  title: string
  templateId: string
  themeConfig?: ICvThemeConfig
  content?: ICvContent
  pdfUrl?: string
  thumbnailUrl?: string
  isDefault: boolean
  userId?: number
  createdAt?: string
  updatedAt?: string
}

export interface ICreateCandidateCvReq {
  title: string
  templateId?: string
  themeConfig?: ICvThemeConfig
  content?: ICvContent
  isDefault?: boolean
}

export interface IUpdateCandidateCvReq {
  title?: string
  templateId?: string
  themeConfig?: ICvThemeConfig
  content?: ICvContent
  pdfUrl?: string
  thumbnailUrl?: string
  isDefault?: boolean
}
