import axios from "../config/axios";
import {
  IAccount,
  IBackendRes,
  IGetAccount,
  IBackendLoginRes,
} from "../types/backend";
export async function login(
  username: string,
  password: string
): Promise<IBackendLoginRes<IAccount>> {
  const response = await axios.post<IBackendLoginRes<IAccount>>(
    "/api/v1/auth/login",
    { username, password }
  );
  return response.data;
}

export async function fetchAccount(): Promise<IBackendRes<IGetAccount>> {
  const response = await axios.get<IBackendRes<IGetAccount>>(
    "/api/v1/auth/account"
  );
  return response.data;
}
