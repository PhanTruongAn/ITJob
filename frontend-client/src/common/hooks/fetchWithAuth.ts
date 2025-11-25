import axiosInstance from "@/configs/axiosInstance"
import { getSession } from "next-auth/react"

export const fetchWithAuth = async <T>(url: string, options: any = {}) => {
  const session = await getSession()
  const headers = {
    ...options.headers,
    ...(session?.accessToken
      ? { Authorization: `Bearer ${session.accessToken}` }
      : {}),
  }

  return axiosInstance({ url, ...options, headers }).then(
    (res) => res.data as T
  )
}
