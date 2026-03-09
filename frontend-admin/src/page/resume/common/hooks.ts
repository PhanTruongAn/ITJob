import { useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useState } from "react"
import {
  approveResume,
  deleteResume,
  rejectResume,
  reviewResume,
} from "../../../apis/resumeModule"
import CustomHooks from "../../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../../common/queryKeys"
import { useUpdateState } from "../../../util/hooks"
import { ResumeState } from "./interface"

export const useResumeState = () => {
  const [state, setState] = useState<ResumeState>({
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    visibleDeleteModal: false,
    visibleRejectModal: false,
    selectedId: null,
    rejectNote: "",
  })

  const updateState = useUpdateState(setState)

  return { state, updateState }
}

export const useApproveResume = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(approveResume, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RESUME_MODULE],
      })
      message.success("Resume approved successfully")
    },
  })
}

export const useReviewResume = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(reviewResume, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RESUME_MODULE],
      })
      message.success("Resume status updated to REVIEWING")
    },
  })
}

export const useRejectResume = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(
    ({ id, note }: { id: number; note: string }) => rejectResume(id, note),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.RESUME_MODULE],
        })
        message.success("Resume rejected successfully")
      },
    },
  )
}

export const useDeleteResume = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(deleteResume, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RESUME_MODULE],
      })
      message.success("Resume deleted successfully")
    },
  })
}
