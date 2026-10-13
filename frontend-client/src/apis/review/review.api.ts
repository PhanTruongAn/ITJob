import { API_PATHS } from "@/common/apiPaths"
import { fetchPublic } from "@/common/hooks/fetchPublic"
import { fetchWithAuth } from "@/common/hooks/fetchWithAuth"
import { IApiResponse, IPaginatedData } from "../common/response.types"

export interface ICompanyReview {
  id: number
  userName: string
  rating: number
  comment: string
  hidden: boolean
}

export interface ICompanyReviewSummary {
  averageRating: number | null
  totalReviews: number
  oneStarCount: number
  twoStarCount: number
  threeStarCount: number
  fourStarCount: number
  fiveStarCount: number
}

export interface ICreateReviewReq {
  companyId: number
  rating: number
  comment: string
}

export const reviewApi = {
  getReviewsByCompany: (companyId: number, page: number, size: number) =>
    fetchPublic<IApiResponse<IPaginatedData<ICompanyReview>>>(API_PATHS.PUBLIC_REVIEW, {
      method: "GET",
      params: { companyId, page, size },
    }),

  getReviewSummary: (companyId: number) =>
    fetchPublic<IApiResponse<ICompanyReviewSummary>>(
      `${API_PATHS.PUBLIC_REVIEW}/${companyId}/summary`,
      { method: "GET" },
    ),

  createReview: (data: ICreateReviewReq) =>
    fetchWithAuth<IApiResponse<ICompanyReview>>(API_PATHS.REVIEW, {
      method: "POST",
      data,
    }),
}
