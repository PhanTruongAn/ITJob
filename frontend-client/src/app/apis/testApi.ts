import { IBackendRes } from "../types/backend";
import axiosInstance from "../configs/axiosInstance";

class AuthService {
  static async getHelloWorld(): Promise<IBackendRes<string>> {
    return await axiosInstance.get<IBackendRes<string>>("/");
  }
}
