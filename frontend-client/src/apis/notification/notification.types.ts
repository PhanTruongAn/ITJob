import { IApiResponse, IPaginatedData } from "@/apis/common/response.types"

export type ApplicationStatus = "REVIEWING" | "APPROVED" | "REJECTED"

export interface INotification {
  id: number
  type: "APPLICATION_STATUS_CHANGED"
  applicationStatus: ApplicationStatus
  relatedResumeId: number
  jobId?: number
  jobTitle?: string
  read: boolean
  createdAt: string
}

export interface IUnreadNotificationCount {
  count: number
}

export type INotificationListResponse = IApiResponse<IPaginatedData<INotification>>
export type IUnreadNotificationCountResponse = IApiResponse<IUnreadNotificationCount>
