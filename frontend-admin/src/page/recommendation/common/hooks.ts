import { useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useState } from "react"
import {
  deleteRecommendation,
  fetchJobRecommendationById,
  generateRecommendations,
  updateEmailStatus,
} from "../../../apis/recommendationModule"
import CustomHooks from "../../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../../common/queryKeys"
import { useUpdateState } from "../../../util/hooks"
import { RecommendationState } from "./interface"

export const useRecommendationState = () => {
  const [state, setState] = useState<RecommendationState>({
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    visibleDeleteModal: false,
    selectedId: null,
    selectedRecord: undefined,
    detailDrawerOpen: false,
    detailId: null,
    filters: {},
  })

  const updateState = useUpdateState(setState)

  return { state, updateState }
}

export const useGenerateRecommendations = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(generateRecommendations, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RECOMMENDATION_MODULE],
      })
      message.success("Recommendations generation triggered")
    },
  })
}

export const useUpdateEmailStatus = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(
    ({ id, emailStatus }: { id: number; emailStatus: string }) =>
      updateEmailStatus(id, emailStatus),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.RECOMMENDATION_MODULE],
        })
        message.success("Status updated successfully")
      },
    },
  )
}

export const useDeleteRecommendation = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(deleteRecommendation, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RECOMMENDATION_MODULE],
      })
      message.success("Recommendation deleted successfully")
    },
  })
}

export const useFetchRecommendationDetail = (id: number | null) => {
  return CustomHooks.useQuery(
    [QUERY_KEYS.RECOMMENDATION_MODULE, "detail", id],
    () => fetchJobRecommendationById(id!),
    { enabled: id !== null },
  )
}
