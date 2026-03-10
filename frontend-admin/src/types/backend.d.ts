import { ECompany, GenderEnum } from "./enum"

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY"
export interface IBackendPaginateRes<T> {
  statusCode: number
  error: any
  message: string
  data: {
    meta: {
      pageNumber?: number
      pageSize?: number
      pages?: number
      total?: number
    }
    result: T
  }
}

export interface IBackendRes<T> {
  statusCode: number
  error: any
  message: string
  data: T
}
export interface IFetchDataParams {
  page: number
  pageSize: number
  sort?: string
}
export interface ILoginRes {
  access_token: string
  refresh_token: string
  user: IAccountRes
}

export interface IAccountRes {
  id: number
  name: string
  email: string
  avatar?: string
}

export interface IUser {
  id: number
  name: string
  email: string
  address: string
  phone: string
  gender: GenderEnum
  dob: Date
  createdAt: Date
  updatedAt: Date
}

// Country
export interface ICountry {
  id: number
  code: string
  name: string
}
// Company

export interface ICompany {
  id: number
  name: string
  address: string
  companyType: ECompany
  companySize: string
  status: ECompanyStatus
  industry: string
  overtime: boolean
  description: string
  logo: string
  workingDays: DayOfWeek[]
  country: ICountry
}

export interface ICreateCompanyDTO {
  name: string
  address: string
  companyType: ECompany
  companySize: string
  industry: string
  overtime: boolean
  description: string
  logo: string
  workingDays: DayOfWeek[]
  countryId: number
}

export interface ICloud {
  timestamp: number
  cloudName: string
  apiKey: string
  signature: string
  uploadUrl: string
  uploadPreset: string
}
// IGetAccount inherits from IAccount but excludes access_token

export interface IParamLogin {
  email: string
  password: string
}
export interface IGetAccount extends Omit<IAccount, "access_token"> {}
export interface IEditCompanyDTO extends Omit<ICompany, "country"> {}

export interface ISkill {
  id: number
  name: string
  description?: string
  category?: string
}

export interface ISubscriber {
  id: number
  email: string
  name: string
  skills: ISkill[]
}

export interface ICompanyReview {
  id: number
  companyId: number
  content: string
  rating: number
}

export interface IPermission {
  id: number
  name: string
  apiPath: string
  method: string
  action: string
  resource: string
}

export interface IRole {
  id: number
  name: string
  description: string
  active: boolean
  permissions: IPermission[]
}

export interface IResume {
  id: number
  candidateName: string
  phoneNumber: string
  email: string
  url: string
  status: string
  companyId: number
  jobId: number
  note?: string
}

export interface IJobRecommendation {
  id: number
  jobTitle: string
  subscriberEmail: string
  status: "PENDING" | "SENT" | "CLICKED" | "IGNORED"
  createdAt: Date
}
