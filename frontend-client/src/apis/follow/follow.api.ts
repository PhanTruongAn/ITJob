import { API_PATHS } from "@/common/apiPaths"
import { fetchWithAuth } from "@/common/hooks/fetchWithAuth"
import { IApiResponse } from "../common/response.types"

export interface IFollowResponse {
  id: number
  companyId: number
  companyName: string
  companyLogo: string
  active: boolean
}

export const followApi = {
  getStatus: (companyId: number) =>
    fetchWithAuth<IApiResponse<boolean>>(`${API_PATHS.FOLLOW}/${companyId}/status`, {
      method: "GET",
    }),

  toggleFollow: (companyId: number) =>
    fetchWithAuth<IApiResponse<IFollowResponse>>(API_PATHS.FOLLOW, {
      method: "POST",
      data: { companyId },
    }),
}
