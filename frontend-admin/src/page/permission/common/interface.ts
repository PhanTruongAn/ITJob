import { IPermission } from "../../../types/backend"

export interface PermissionState {
  page: number
  pageSize: number
  total: number
  loading: boolean
  visibleDeleteModal: boolean
  visibleEditModal: boolean
  visibleCreateModal: boolean
  selectedId: number | null
  selectedRecord: IPermission | undefined
}
