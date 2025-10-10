import axios from "../config/axios"
import { IAccountRes, IBackendRes, ILoginRes } from "../types/backend"
export async function login(
  username: string,
  password: string
): Promise<IBackendRes<ILoginRes>> {
  const response = await axios.post<IBackendRes<ILoginRes>>(
    "/api/v1/auth/login",
    { username, password }
  )
  return response.data
}

export async function fetchAccount(): Promise<IBackendRes<IAccountRes>> {
  const response = await axios.get<IBackendRes<IAccountRes>>(
    "/api/v1/auth/account"
  )
  return response.data
}

export async function logout(): Promise<IBackendRes<null>> {
  const response = await axios.post<IBackendRes<null>>("/api/v1/auth/logout")
  return response.data
}
