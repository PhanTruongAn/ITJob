import axiosInstance from "../config/axios"
import {
  IBackendPaginateRes,
  IBackendRes,
  IEmployerApplicationNotification,
} from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function fetchEmployerApplicationNotifications(params: {
  page: number
  size: number
}): Promise<IBackendPaginateRes<IEmployerApplicationNotification[]>> {
  const query = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
  })
  const response = await axiosInstance.get<
    IBackendPaginateRes<IEmployerApplicationNotification[]>
  >(`${PATH_API.employerNotifications.root}?${query.toString()}`)
  return response.data
}

export async function fetchEmployerUnreadNotificationCount(): Promise<
  IBackendRes<{ count: number }>
> {
  const response = await axiosInstance.get<IBackendRes<{ count: number }>>(
    `${PATH_API.employerNotifications.root}/unread-count`,
  )
  return response.data
}

export async function markEmployerNotificationRead(id: number): Promise<IBackendRes<boolean>> {
  const response = await axiosInstance.patch<IBackendRes<boolean>>(
    `${PATH_API.employerNotifications.root}/${id}/read`,
  )
  return response.data
}

export async function markAllEmployerNotificationsRead(): Promise<IBackendRes<number>> {
  const response = await axiosInstance.patch<IBackendRes<number>>(
    `${PATH_API.employerNotifications.root}/read-all`,
  )
  return response.data
}
