import { IBackendRes } from "../types/backend";
import axiosInstance from "../configs/axiosInstance";

export class AuthService {
  static async getHelloWorld(): Promise<IBackendRes<string>> {
    const response = await axiosInstance.get<IBackendRes<string>>("/");
    return response.data;
  }
}
