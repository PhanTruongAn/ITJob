import axiosInstance from "../config/axios"
import { IBackendPaginateRes, IBackendRes, IManagementReviewNotification } from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function fetchManagementReviewNotifications(params: {
  page: number
  size: number
}): Promise<IBackendPaginateRes<IManagementReviewNotification[]>> {
  const query = new URLSearchParams({ page: String(params.page), size: String(params.size) })
  const response = await axiosInstance.get<IBackendPaginateRes<IManagementReviewNotification[]>>(
    `${PATH_API.managementReviewNotifications.root}?${query.toString()}`,
  )
  return response.data
}

export async function fetchManagementPendingReviewCount(): Promise<IBackendRes<{ count: number }>> {
  const response = await axiosInstance.get<IBackendRes<{ count: number }>>(
    `${PATH_API.managementReviewNotifications.root}/pending-count`,
  )
  return response.data
}
