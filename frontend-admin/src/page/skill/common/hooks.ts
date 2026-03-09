import { useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useState } from "react"
import {
  createSkill,
  deleteSkill,
  updateSkill,
} from "../../../apis/skillModule"
import CustomHooks from "../../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../../common/queryKeys"
import { useUpdateState } from "../../../util/hooks"
import { SkillState } from "./interface"

export const useSkillState = () => {
  const [state, setState] = useState<SkillState>({
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

export const useCreateSkill = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(createSkill, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SKILL_MODULE],
      })
      message.success("Skill created successfully")
    },
  })
}

export const useEditSkill = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(updateSkill, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SKILL_MODULE],
      })
      message.success("Skill updated successfully")
    },
  })
}

export const useDeleteSkill = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(deleteSkill, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SKILL_MODULE],
      })
      message.success("Skill deleted successfully")
    },
  })
}
