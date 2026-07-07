import { API_PATHS } from "@/common/apiPaths"
import { fetchWithAuth } from "@/common/hooks/fetchWithAuth"
import { IApiResponse, IPaginatedData } from "../common/response.types"

export interface ICompanyReview {
  id: number
  userName: string
  rating: number
  comment: string
  hidden: boolean
}

export interface ICreateReviewReq {
  companyId: number
  userId: number
  rating: number
  comment: string
}

export const reviewApi = {
  getReviewsByCompany: (companyId: number, page: number, size: number) =>
    fetchWithAuth<IApiResponse<IPaginatedData<ICompanyReview>>>(API_PATHS.PUBLIC_REVIEW, {
      method: "GET",
      params: { companyId, page, size },
    }),

  createReview: (data: ICreateReviewReq) =>
    fetchWithAuth<IApiResponse<ICompanyReview>>(API_PATHS.REVIEW, {
      method: "POST",
      data,
    }),
}
