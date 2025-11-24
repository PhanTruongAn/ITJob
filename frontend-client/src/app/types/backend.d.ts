export interface IBackendRes<T> {
  error?: string | string[]
  message: string
  statusCode: number | string
  data?: T | string
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
