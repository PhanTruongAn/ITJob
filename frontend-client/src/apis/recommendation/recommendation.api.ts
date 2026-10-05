import { API_PATHS } from "@/common/apiPaths"
import { fetchWithAuth } from "@/common/hooks/fetchWithAuth"
import { IApiResponse } from "../common/response.types"
import { ICandidateRecommendationPage } from "./recommendation.types"

export const recommendationApi = {
  getForCurrentCandidate: (params: { page: number; size: number }) =>
    fetchWithAuth<IApiResponse<ICandidateRecommendationPage>>(
      API_PATHS.CANDIDATE_RECOMMENDATIONS,
      { method: "GET", params },
    ),
}
