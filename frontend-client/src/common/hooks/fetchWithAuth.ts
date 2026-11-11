import axiosInstance from "@/configs/axiosInstance"
import { assertApiSuccess } from "@/common/utils/queryBehavior.mjs"

export const fetchWithAuth = async <T>(url: string, options: any = {}) => {
  const res = await axiosInstance({ url, ...options })
  return assertApiSuccess(res.data as T)
}
