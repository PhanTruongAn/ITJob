import axiosInstance from "../../configs/axiosInstance"
import { IBackendRes, ILoginRes } from "../../types/backend"

export class AuthService {
  static async getHelloWorld(): Promise<IBackendRes<string>> {
    const response = await axiosInstance.get<IBackendRes<string>>("/")
    return response.data
  }
  static async login(
    username: string,
    password: string
  ): Promise<IBackendRes<ILoginRes>> {
    const response = await axiosInstance.post<IBackendRes<ILoginRes>>(
      "/api/v1/auth/login",
      { username, password }
    )
    console.log(response.data)
    return response.data
  }
}
