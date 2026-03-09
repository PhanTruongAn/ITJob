import { useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useState } from "react"
import {
  createSubscriber,
  deleteSubscriber,
  getSubscriberById,
  updateSubscriber,
} from "../../../apis/subscriberModule"
import CustomHooks from "../../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../../common/queryKeys"
import { useUpdateState } from "../../../util/hooks"
import { SubscriberState } from "./interface"


export const useSubscriberState = () => {
  const [state, setState] = useState<SubscriberState>({
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    visibleDeleteModal: false,
    visibleEditModal: false,
    visibleCreateModal: false,
    selectedId: null,
    selectedRecord: undefined,
  })

  const updateState = useUpdateState(setState)

  return { state, updateState }
}


// Hook for creating a subscriber
export const useCreateSubscriber = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(createSubscriber, {
    onSuccess: () => {
      // Invalidate subscriber list query to refetch data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUBSCRIBER_MODULE],
      })
      message.success("Subscriber created successfully")
    },
  })
}

// Hook for deleting a subscriber
export const useDeleteSubscriber = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(deleteSubscriber, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUBSCRIBER_MODULE],
      })
      message.success("Subscriber deleted successfully")
    },
  })
}

// Hook for fetching a subscriber by ID (used in edit modal if needed)
export const useGetSubscriberById = (id: number) => {
  return CustomHooks.useQuery([QUERY_KEYS.SUBSCRIBER_MODULE, id], () =>
    getSubscriberById({ id }),
  )
}

// Hook for editing a subscriber
export const useEditSubscriber = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(updateSubscriber, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUBSCRIBER_MODULE],
      })
      message.success("Subscriber updated successfully")
    },
  })
}
