import { useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useState } from "react"
import {
  createPermission,
  deletePermission,
  updatePermission,
} from "../../../apis/permissionModule"
import CustomHooks from "../../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../../common/queryKeys"
import { useUpdateState } from "../../../util/hooks"
import { PermissionState } from "./interface"

export const usePermissionState = () => {
  const [state, setState] = useState<PermissionState>({
    page: 1,
    pageSize: 1000,
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

export const useCreatePermission = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(createPermission, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PERMISSION_MODULE],
      })
      message.success("Permission created successfully")
    },
  })
}

export const useEditPermission = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(updatePermission, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PERMISSION_MODULE],
      })
      message.success("Permission updated successfully")
    },
  })
}

export const useDeletePermission = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(deletePermission, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PERMISSION_MODULE],
      })
      message.success("Permission deleted successfully")
    },
  })
}
