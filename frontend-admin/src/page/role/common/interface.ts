import { IRole } from "../../../types/backend"

export interface RoleState {
  page: number
  pageSize: number
  total: number
  loading: boolean
  visibleDeleteModal: boolean
  visibleEditModal: boolean
  visibleCreateModal: boolean
  selectedId: number | null
  selectedRecord: IRole | undefined
}
