import { Mutex } from "async-mutex"
import axios from "axios"
import { getSession } from "next-auth/react"

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

const whiteList = ["/api/v1/auth/login", "/api/v1/auth/register"]

//
// REQUEST INTERCEPTOR
//
axiosInstance.interceptors.request.use(async (config) => {
  const session: any = await getSession()

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

//
// RESPONSE INTERCEPTOR
//
axiosInstance.interceptors.response.use(
  (res) => res,
  function (error) {
    return error.response.data
    // return Promise.reject(error);
  },
)

export default axiosInstance
