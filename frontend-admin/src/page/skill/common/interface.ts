import { ISkill } from "../../../types/backend"

export interface SkillState {
  page: number
  pageSize: number
  total: number
  loading: boolean
  visibleDeleteModal: boolean
  visibleEditModal: boolean
  visibleCreateModal: boolean
  selectedId: number | null
  selectedRecord: ISkill | undefined
}
