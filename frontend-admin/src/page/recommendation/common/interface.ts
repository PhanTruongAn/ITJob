import { IJobRecommendation } from "../../../types/backend"

export interface RecommendationState {
  page: number
  pageSize: number
  total: number
  loading: boolean
  visibleDeleteModal: boolean
  selectedId: number | null
  selectedRecord: IJobRecommendation | undefined
}
