import { IAccount, IBackendRes } from "../types/backend";
import axiosInstance from "../configs/axiosInstance";

export class AuthService {
  static async getHelloWorld(): Promise<IBackendRes<string>> {
    const response = await axiosInstance.get<IBackendRes<string>>("/");
    return response.data;
  }
  static async login(
    username: string,
    password: string
  ): Promise<IBackendRes<IAccount>> {
    const response = await axiosInstance.post<IBackendRes<IAccount>>(
      "/api/v1/auth/login",
      { username, password }
    );
    return response.data;
  }
}
