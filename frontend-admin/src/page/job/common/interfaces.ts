import { ICompany } from "../../../types/backend"
import { LevelEnum } from "./enums"

export interface IJob {
  id: number
  name: string
  location: string
  description: string
  quantity: number
  salary: number | null
  level: LevelEnum
  startDate: string
  endDate: string
  isActive: boolean
  company: ICompany
  jobSkills: IJobSkill[]
}

export interface ICreateJobReq {
  name: string
  location: string
  description: string
  quantity: number
  salary: number | null
  level: LevelEnum
  startDate: string
  endDate: string
  isActive: boolean
  companyId?: number
  jobSkillIds?: number[]
}

export interface IEditJobDTO extends ICreateJobReq {
  id: number
}

export interface IJobState extends IFilterJob {
  page: number
  pageSize: number
  total: number
  loading: boolean
  sort?: string
  visibleDeleteModal: boolean
  visibleEditModal: boolean
  typeModal: "view" | "edit"
}

export interface IFilterJob {
  name?: string | null
  location?: string | null
  minSalary?: number | null
  maxSalary?: number | null
  level?: LevelEnum | null
  companyId?: number | null
  skillId?: number | null
}

export interface IJobSkill {
  id: number
  required: boolean
  priority: number
  skill: ISkill
}

export interface ISkill {
  id: number
  name: string
  description: string
  category: string
}
