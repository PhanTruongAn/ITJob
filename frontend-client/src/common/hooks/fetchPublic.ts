import axiosPublic from "@/configs/axiosPublic"
import { assertApiSuccess } from "@/common/utils/queryBehavior.mjs"

export const fetchPublic = async <T>(url: string, options: any = {}) => {
  const res = await axiosPublic({ url, ...options })
  return assertApiSuccess(res.data as T)
}
