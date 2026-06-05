import { IPaginatedData } from "../common/response.types"

export interface IJobSkill {
  id: number
  name: string
  type: string
}

export interface IJob {
  id: number
  name: string
  location: string
  description: string
  quantity: number
  salary: number
  level: string
  startDate: string
  endDate: string
  active: boolean
  companyId: number
  companyName: string
  jobSkills: IJobSkill[]
}

export interface IGetListJobReq {
  name?: string
  location?: string
  minSalary?: number
  maxSalary?: number
  level?: string
  companyId?: number
  skillId?: number
  page: number
  size: number
}

export type IJobListRes = IPaginatedData<IJob>
export type IJobDetailRes = IJob
