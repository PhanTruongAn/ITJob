import { Mutex } from "async-mutex"
import axios, { AxiosRequestConfig } from "axios"
import { getSession, signOut } from "next-auth/react"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

const mutex = new Mutex()
const NO_RETRY_HEADER = "x-no-retry"

//
// REQUEST INTERCEPTOR — tự động gắn access token
//
axiosInstance.interceptors.request.use(async (config) => {
  const session: any = await getSession()

  console.log(`[axios-req] ${config.method?.toUpperCase()} ${config.url} | hasToken=${!!session?.accessToken} | sessionError=${session?.error || 'none'}`)

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

//
// RESPONSE INTERCEPTOR — reject lỗi để React Query bắt được
//
axiosInstance.interceptors.response.use(
  (res) => {
    console.log(`[axios-res] ${res.config.url} → ${res.status} OK`)
    return res
  },
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config
    const status = error.response?.status

    console.log(`[axios-err] ${originalRequest?.url} → ${status} | _retry=${originalRequest?._retry} | noRetryHeader=${!!originalRequest?.headers?.[NO_RETRY_HEADER]}`)

    // Nếu lỗi 401 và chưa retry và không phải request nội bộ
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.headers?.[NO_RETRY_HEADER]
    ) {
      originalRequest._retry = true

      // Nếu mutex đã bị lock (đang có request khác refresh), đợi rồi lấy session mới
      if (mutex.isLocked()) {
        console.log(`[axios-err] Mutex locked, waiting for unlock...`)
        await mutex.waitForUnlock()
        // Sau khi unlock, session đã được refresh bởi request trước
        const freshSession: any = await getSession()
        console.log(`[axios-err] Mutex unlocked, got fresh session hasToken=${!!freshSession?.accessToken}`)
        if (freshSession?.accessToken) {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${freshSession.accessToken}`,
            [NO_RETRY_HEADER]: "true",
          }
          return axiosInstance(originalRequest)
        }
        return Promise.reject(error)
      }

      // Acquire mutex — chỉ 1 request được refresh
      const release = await mutex.acquire()

      try {
        console.log(`[axios-err] Fetching /api/auth/session to trigger server-side refresh...`)
        // Gọi thẳng API NextAuth session để buộc Next.js server chạy jwt() callback
        const sessionRes = await fetch("/api/auth/session")
        const session = await sessionRes.json()

        console.log(`[axios-err] Session response: hasAccessToken=${!!session?.accessToken}, error=${session?.error || 'none'}`)

        // Nếu session đã có error hoặc không có accessToken mới thì logout
        if (session?.error === "RefreshAccessTokenError" || !session?.accessToken) {
          console.log(`[axios-err] Refresh failed or no token → signOut`)
          await signOut({ redirect: true, callbackUrl: "/signin" })
          return Promise.reject(error)
        }

        // Thử lại request với token mới từ session
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${session.accessToken}`,
          [NO_RETRY_HEADER]: "true",
        }
        console.log(`[axios-err] Retrying ${originalRequest.url} with new token`)
        return axiosInstance(originalRequest)
      } catch (err) {
        console.error("[axios-err] Interceptor refresh error:", err)
        return Promise.reject(error)
      } finally {
        release()
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
