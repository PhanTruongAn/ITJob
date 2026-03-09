import { ICompanyReview } from "../../../types/backend"

export interface ReviewState {
  page: number
  pageSize: number
  total: number
  loading: boolean
  visibleDeleteModal: boolean
  selectedId: number | null
}
