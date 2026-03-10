import { useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useState } from "react"
import {
  deleteRecommendation,
  generateRecommendations,
  updateRecommendationStatus,
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

export const useUpdateRecommendationStatus = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(
    ({ id, status }: { id: number; status: string }) =>
      updateRecommendationStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.RECOMMENDATION_MODULE],
        })
        message.success("Status updated successfully")
      },
    }
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
