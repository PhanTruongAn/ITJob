import { ICompany } from "../../../types/backend"
import { LevelEnum } from "./enums"

export interface Job {
  id: number
  name: string
  location: string
  description: string
  quantity: number
  salary: number | null
  level: LevelEnum
  startDate: string
  endDate: string
  active: boolean
  company: ICompany
  jobSkills: JobSkill[]
}

export interface GetListJobResDTO {
  page: number
  pageSize: number
  sort?: string
  name?: string | null
  location?: string | null
  minSalary?: number | null
  maxSalary?: number | null
  level?: LevelEnum | null
  companyId?: number | null
  skillId?: number | null
}

export interface CreateJobReqDTO {
  name: string
  location: string
  description: string
  quantity: number
  salary: number | null
  level: LevelEnum
  startDate: string
  endDate: string
  // isActive: boolean
  companyId?: number
  jobSkillIds?: number[]
}

export interface EditJobReqDTO extends CreateJobReqDTO {
  id: number
}

export interface JobState extends JobFilter {
  page: number
  pageSize: number
  total: number
  loading: boolean
  sort?: string
  visibleDeleteModal: boolean
  visibleEditModal: boolean
  typeModal: "view" | "edit"
}

export interface JobFilter {
  name?: string | null
  location?: string | null
  minSalary?: number | null
  maxSalary?: number | null
  level?: LevelEnum | null
  companyId?: number | null
  skillId?: number | null
}

export interface JobSkill {
  id: number
  required: boolean
  priority: number
  skill: Skill
}

export interface Skill {
  id: number
  name: string
  description: string
  category: string
}

export type SkillOptions = Omit<Skill, "description" | "category">
