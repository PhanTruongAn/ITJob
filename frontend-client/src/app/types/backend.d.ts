export interface IBackendRes<T> {
  error?: string | string[]
  message: string
  statusCode: number | string
  data?: T | string
}

export interface ILoginRes {
  access_token: string
}
