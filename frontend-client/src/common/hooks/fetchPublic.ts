import axiosPublic from "@/configs/axiosPublic"

export const fetchPublic = async <T>(url: string, options: any = {}) => {
  const res = await axiosPublic({ url, ...options })
  return res.data as T
}
