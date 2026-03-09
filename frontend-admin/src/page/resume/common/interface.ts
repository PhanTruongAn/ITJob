import { IResume } from "../../../types/backend"

export interface ResumeState {
  page: number
  pageSize: number
  total: number
  loading: boolean
  visibleDeleteModal: boolean
  visibleRejectModal: boolean
  selectedId: number | null
  rejectNote: string
}
