import { useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useState } from "react"
import { deleteReview } from "../../../apis/reviewModule"
import CustomHooks from "../../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../../common/queryKeys"
import { useUpdateState } from "../../../util/hooks"
import { ReviewState } from "./interface"

export const useReviewState = () => {
  const [state, setState] = useState<ReviewState>({
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    visibleDeleteModal: false,
    selectedId: null,
  })

  const updateState = useUpdateState(setState)

  return { state, updateState }
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(deleteReview, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REVIEW_MODULE],
      })
      message.success("Review deleted successfully")
    },
  })
}
