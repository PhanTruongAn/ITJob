import axios from "axios"

const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Simple response interceptor to reject errors
axiosPublic.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
)

export default axiosPublic
