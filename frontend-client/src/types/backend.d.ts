export interface IBackendRes<T> {
  error?: string | string[]
  message: string
  statusCode: number | string
  data?: T
}

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

export interface IJob {
  id: number
  name: string
  location: string
  salary: number
  quantity: number
  level: string
  jobType?: string
  description: string
  startDate: string
  endDate: string
  isActive: boolean
  companyId?: number
  companyName?: string
  companyLogo?: string
  jobSkills?: { skillId: number; skillName: string }[]
}

export interface ICompany {
  id: number
  name: string
  address: string
  description: string
  logo?: string
}

export interface UserNextAuth {
  id: string
  name: string
  email?: string
  image?: string
  phone?: string
  address?: string
  accessToken?: string
  refreshToken?: string
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
  phone?: string
  address?: string
}

export interface IFile {
  id: number
  fileName: string
  fileKey: string
  fileUrl: string
  fileType: string
  fileExtension: string
  fileSize: number
  category: 'CV' | 'EXCEL' | 'AVATAR' | 'ATTACHMENT' | 'OTHER'
  isDefault: boolean
  createdAt?: string
  createdBy?: string
}

export interface IResume {
  id: number
  candidateName: string
  phoneNumber: string
  note?: string
  email: string
  url: string
  status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED'
  userId: number
  jobId: number
  jobName?: string
  companyId?: number
  companyName?: string
  companyLogo?: string
  createdAt?: string
  updatedAt?: string
}

export interface ICreateResumeReq {
  candidateName: string
  phoneNumber: string
  email: string
  url: string
  jobId: number
  note?: string
  status?: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED'
  userId?: number
}

export interface ISkill {
  id: number
  name: string
  category?: string
  description?: string
}
