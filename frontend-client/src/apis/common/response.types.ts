export interface IApiResponse<T> {
  statusCode: number
  error: string | null
  message: string
  data: T
}

// Pagination meta
export interface IPaginationMeta {
  pageNumber: number
  pageSize: number
  total: number
  pages: number
}

// Paginated response
export interface IPaginatedData<T> {
  result: T[]
  meta: IPaginationMeta
}
