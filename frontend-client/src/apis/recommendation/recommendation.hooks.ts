import CustomHooks from "@/common/hooks/customHooks"
import { isCandidateRole } from "@/common/security/frontendSecurity.mjs"
import { QUERY_KEYS } from "@/common/queryKeys"
import { useSession } from "next-auth/react"
import { recommendationApi } from "./recommendation.api"
import { IApiResponse } from "../common/response.types"
import { ICandidateRecommendationPage } from "./recommendation.types"

export const useCandidateRecommendations = (page = 1, size = 4) => {
  const { data: session, status } = useSession()
  const candidateId = session?.user?.id
  const enabled =
    status === "authenticated" &&
    !!candidateId &&
    isCandidateRole(session?.user?.role)

  return CustomHooks.useQuery<IApiResponse<ICandidateRecommendationPage>>(
    [QUERY_KEYS.RECOMMENDATION_MODULE, "candidate", candidateId ?? "anonymous", page, size],
    () => recommendationApi.getForCurrentCandidate({ page, size }),
    { enabled, placeholderData: undefined, staleTime: 30_000 },
  )
}
