import axiosInstance from "@/configs/axiosInstance"

export const fetchWithAuth = async <T>(url: string, options: any = {}) => {
  const res = await axiosInstance({ url, ...options })
  return res.data as T
}
