import axiosClient from "axios";
import { IBackendRes } from "../types/backend";
import { Mutex } from "async-mutex";
import { message, notification } from "antd";
import { PATH_AUTH } from "../routes/paths";
import { store } from "../redux/store";
import { setUserLoginInfo } from "../redux/slice/accountSlice";
interface IAccount {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const instance = axiosClient.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  withCredentials: true,
});

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

const handleRefreshToken = async (): Promise<IAccount | null> => {
  return await mutex.runExclusive(async () => {
    try {
      const res = await instance.get<IBackendRes<IAccount>>(
        "/api/v1/auth/refresh"
      );
      if (res && res.data && res.data.statusCode === 200) {
        const { access_token, user } = res.data.data;
        return { access_token, user };
      }
      return null;
    } catch (error: any) {
      // Xử lý lỗi khi refresh token thất bại
      const status = error.response?.status;
      if (status === 400 || status === 401) {
        return null;
      }
      // Lỗi khác (mạng, server, v.v.)
      return null;
    }
  });
};

instance.interceptors.request.use(function (config) {
  if (
    typeof window !== "undefined" &&
    window &&
    window.localStorage &&
    window.localStorage.getItem("access_token")
  ) {
    config.headers.Authorization =
      "Bearer " + window.localStorage.getItem("access_token");
  }
  if (!config.headers.Accept && config.headers["Content-Type"]) {
    config.headers.Accept = "application/json";
    config.headers["Content-Type"] = "application/json; charset=utf-8";
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (
      error.config &&
      status === 401 &&
      url !== "/api/v1/auth/login" &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const authData = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = "true";

      if (authData && authData.access_token) {
        const { access_token, user } = authData;
        localStorage.setItem("access_token", access_token);
        error.config.headers["Authorization"] = `Bearer ${access_token}`;
        store.dispatch(setUserLoginInfo(user));
        return instance.request(error.config);
      } else {
        // Xóa access_token và chuyển hướng đến login
        localStorage.removeItem("access_token");
        window.location.href = PATH_AUTH.login;
        return Promise.reject(error);
      }
    }

    if (
      error.config &&
      status === 400 &&
      url === "/api/v1/auth/refresh" &&
      location.pathname.startsWith("/dashboard")
    ) {
      // Xóa access_token và chuyển hướng đến login
      localStorage.removeItem("access_token");
      window.location.href = PATH_AUTH.login;
      message.error("Your session has expired. Please log in again.");
      return Promise.reject(error);
    }

    if (status === 403) {
      notification.error({
        message: error?.response?.data?.error ?? "",
        description: error?.response?.data?.message ?? "",
      });
    }

    return error?.response ?? Promise.reject(error);
  }
);

export default instance;
