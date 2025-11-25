import { IPaginatedData } from "../common/response.types"

export interface ICompany {
  id: number
  name: string
  companyType: CompanyTypeEnum
  companySize: string
  status: CompanyStatus
  industry: string
  overtime: boolean
  workingDays: string[]
  country: {
    id: number
    code: string
    name: string
  }
  description: string
  address: string
  logo: string
}

export interface IGetListCompanyReq {
  name?: string
  address?: string
  companyType?: CompanyTypeEnum
  companySize?: string
  status?: CompanyStatus
  countryId?: number
  page: number
  size: number
}

export enum CompanyTypeEnum {
  IT_OUTSOURCING = "IT_OUTSOURCING",
  IT_PRODUCT = "IT_PRODUCT",
  IT_SERVICE_AND_CONSULTING = "IT_SERVICE_AND_CONSULTING",
}

export const CompanyTypeDisplayName: Record<CompanyTypeEnum, string> = {
  [CompanyTypeEnum.IT_OUTSOURCING]: "IT Outsourcing",
  [CompanyTypeEnum.IT_PRODUCT]: "IT Product",
  [CompanyTypeEnum.IT_SERVICE_AND_CONSULTING]: "IT Service and IT Consulting",
}

export enum CompanyStatus {
  PENDING = "PENDING",
  CHECKING = "CHECKING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type ICompanyListRes = IPaginatedData<ICompany>
export type ICompanyDetailRes = ICompany
