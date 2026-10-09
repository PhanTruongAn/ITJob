"use client"

import CustomHooks from "@/common/hooks/customHooks"
import { QUERY_KEYS } from "@/common/queryKeys"
import { isCandidateRole } from "@/common/security/frontendSecurity.mjs"
import { useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { notificationApi } from "./notification.api"
import { INotificationListResponse, IUnreadNotificationCountResponse } from "./notification.types"

export const notificationKeys = {
  candidate: (userId: string) => [QUERY_KEYS.NOTIFICATION_MODULE, "candidate", userId] as const,
  list: (userId: string, page: number, size: number) =>
    [...notificationKeys.candidate(userId), "list", page, size] as const,
  unreadCount: (userId: string) =>
    [...notificationKeys.candidate(userId), "unread-count"] as const,
}

function useCandidateIdentity() {
  const { data: session, status } = useSession()
  const userId = session?.user?.id
  const hasCandidateAccess =
    status === "authenticated" && !!userId && isCandidateRole(session?.user?.role)
  return { userId, status, hasCandidateAccess }
}

export function useCandidateNotifications(page: number, size: number) {
  const { userId, status, hasCandidateAccess } = useCandidateIdentity()
  const query = CustomHooks.useQuery<INotificationListResponse>(
    notificationKeys.list(userId ?? "anonymous", page, size),
    () => notificationApi.getNotifications(page, size),
    { enabled: hasCandidateAccess, placeholderData: undefined, staleTime: 30_000 },
  )
  return { ...query, userId, sessionStatus: status, hasCandidateAccess }
}

export function useUnreadNotificationCount() {
  const { userId, hasCandidateAccess } = useCandidateIdentity()
  return CustomHooks.useQuery<IUnreadNotificationCountResponse>(
    notificationKeys.unreadCount(userId ?? "anonymous"),
    notificationApi.getUnreadCount,
    { enabled: hasCandidateAccess, placeholderData: undefined, staleTime: 30_000 },
  )
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  const { userId } = useCandidateIdentity()
  return CustomHooks.useMutation(
    notificationApi.markAsRead,
    {
      onSuccess: () => {
        if (userId) queryClient.invalidateQueries({ queryKey: notificationKeys.candidate(userId) })
      },
    },
  )
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  const { userId } = useCandidateIdentity()
  return CustomHooks.useMutation(
    notificationApi.markAllAsRead,
    {
      onSuccess: () => {
        if (userId) queryClient.invalidateQueries({ queryKey: notificationKeys.candidate(userId) })
      },
    },
  )
}
