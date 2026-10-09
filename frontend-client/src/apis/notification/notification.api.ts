import { API_PATHS } from "@/common/apiPaths"
import { fetchWithAuth } from "@/common/hooks/fetchWithAuth"
import { IApiResponse } from "@/apis/common/response.types"
import {
  INotificationListResponse,
  IUnreadNotificationCountResponse,
} from "./notification.types"

export const notificationApi = {
  getNotifications: (page: number, size: number) =>
    fetchWithAuth<INotificationListResponse>(API_PATHS.CANDIDATE_NOTIFICATIONS, {
      method: "GET",
      params: { page, size },
    }),

  getUnreadCount: () =>
    fetchWithAuth<IUnreadNotificationCountResponse>(
      `${API_PATHS.CANDIDATE_NOTIFICATIONS}/unread-count`,
      { method: "GET" },
    ),

  markAsRead: (notificationId: number) =>
    fetchWithAuth<IApiResponse<boolean>>(
      `${API_PATHS.CANDIDATE_NOTIFICATIONS}/${notificationId}/read`,
      { method: "PATCH" },
    ),

  markAllAsRead: () =>
    fetchWithAuth<IApiResponse<number>>(
      `${API_PATHS.CANDIDATE_NOTIFICATIONS}/read-all`,
      { method: "PATCH" },
    ),
}
