import { ISubscriber } from "../../../types/backend"

export interface SubscriberState {
  page: number
  pageSize: number
  total: number
  loading: boolean
  visibleDeleteModal: boolean
  visibleEditModal: boolean
  visibleCreateModal: boolean
  selectedId: number | null
  selectedRecord: ISubscriber | undefined
}
