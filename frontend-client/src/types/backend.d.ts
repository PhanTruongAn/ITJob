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
  description: string
  startDate: string
  endDate: string
  isActive: boolean
  company?: ICompany
  skills?: any[]
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
}
