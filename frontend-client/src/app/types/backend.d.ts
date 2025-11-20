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
  accessToken?: string
}

export interface ILoginRes {
  access_token: string
}
