import axiosInstance from "../config/axios"
import {
  IBackendPaginateRes,
  IBackendRes,
  ICompanyReview,
} from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function fetchReviews(params: {
  companyId?: number
  page?: number
  pageSize?: number
}): Promise<IBackendPaginateRes<ICompanyReview[]>> {
  const q = new URLSearchParams()
  if (params.companyId && params.companyId > 0) {
    q.append("companyId", params.companyId.toString())
  }
  if (params.page) q.append("page", params.page.toString())
  if (params.pageSize) q.append("size", params.pageSize.toString())

  const response = await axiosInstance.get<
    IBackendPaginateRes<ICompanyReview[]>
  >(`${PATH_API.review.root}?${q.toString()}`)
  return response.data
}

export async function getReviewById(
  id: number,
): Promise<IBackendRes<ICompanyReview>> {
  const response = await axiosInstance.get<IBackendRes<ICompanyReview>>(
    `${PATH_API.review.root}/${id}`,
  )
  return response.data
}

export async function updateReview(data: {
  id: number
  hidden?: boolean
  comment?: string
  rating?: number
}) {
  const response = await axiosInstance.put<IBackendRes<ICompanyReview>>(
    `${PATH_API.review.root}`,
    data,
  )
  return response.data
}

export async function deleteReview({ id }: { id: number }) {
  const response = await axiosInstance.delete<IBackendRes<any>>(
    `${PATH_API.review.root}/${id}`,
  )
  return response.data
}
