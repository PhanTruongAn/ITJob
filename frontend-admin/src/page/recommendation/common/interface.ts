import { IJobRecommendation } from "../../../types/backend"

export interface RecommendationFilter {
  subscriberId?: number
  companyId?: number
  status?: string
  keyword?: string
  fromDate?: string
  toDate?: string
  minMatch?: number
}

export interface RecommendationState {
  page: number
  pageSize: number
  total: number
  loading: boolean
  visibleDeleteModal: boolean
  selectedId: number | null
  selectedRecord: IJobRecommendation | undefined
  detailDrawerOpen: boolean
  detailId: number | null
  filters: RecommendationFilter
}
