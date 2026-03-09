import { useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useState } from "react"
import {
  createRole,
  deleteRole,
  updateRole,
} from "../../../apis/roleModule"
import CustomHooks from "../../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../../common/queryKeys"
import { useUpdateState } from "../../../util/hooks"
import { RoleState } from "./interface"

export const useRoleState = () => {
  const [state, setState] = useState<RoleState>({
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

export const useCreateRole = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(createRole, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLE_MODULE],
      })
      message.success("Role created successfully")
    },
  })
}

export const useEditRole = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(updateRole, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLE_MODULE],
      })
      message.success("Role updated successfully")
    },
  })
}

export const useDeleteRole = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(deleteRole, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLE_MODULE],
      })
      message.success("Role deleted successfully")
    },
  })
}
