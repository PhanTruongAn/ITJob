import { IPaginatedData } from "../common/response.types"

export interface ISavedJobResource {
  id: number
  name: string
  location?: string
  salary?: number
  level?: string
  jobType?: string
  startDate?: string
  endDate?: string
  companyId?: number
  companyName?: string
  companyLogo?: string
  jobSkills?: { skillId?: number; skillName?: string }[]
}

export interface ISavedCompanyResource {
  id: number
  name: string
  logo?: string
  industry?: string
  rating?: number
  reviews?: number
  description?: string
  jobCount?: number
}

export interface ISavedJob {
  id: number
  job: ISavedJobResource
}

export interface ISavedCompany {
  id: number
  company: ISavedCompanyResource
}

export type ISavedJobPage = IPaginatedData<ISavedJob>
export type ISavedCompanyPage = IPaginatedData<ISavedCompany>

export interface IBookmarkPageReq {
  page: number
  size: number
}
