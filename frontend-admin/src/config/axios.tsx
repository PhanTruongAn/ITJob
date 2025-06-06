import { message } from "antd";
import { Mutex } from "async-mutex";
import axiosClient from "axios";
import { PATH_AUTH } from "../routes/paths";
import { IBackendRes } from "../types/backend";
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
const whiteList: string[] = [
  "/api/v1/auth/login",
  "/api/v1/auth/refresh",
  "/api/v1/auth/logout",
];
const handleRefreshToken = async (): Promise<IAccount | null> => {
  return await mutex.runExclusive(async () => {
    try {
      const res = await instance.get<IBackendRes<IAccount>>(
        "/api/v1/auth/refresh",
        { headers: { [NO_RETRY_HEADER]: "true" } }
      );
      if (res && res.data && res.data.statusCode === 200) {
        const { access_token, user } = res.data.data;
        localStorage.setItem("access_token", access_token);
        return { access_token, user };
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("session");
        message.error("Your session has expired. Please log in again.");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.href = PATH_AUTH.login;
      }
      throw new Error("Refresh token failed");
    } catch (error: any) {
      console.log("Error: ", error);
      return null;
    }
  });
};

instance.interceptors.request.use(function (config) {
  const access_token = localStorage.getItem("access_token");
  if (access_token && config.url && !whiteList.includes(config.url)) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  if (!config.headers.Accept || !config.headers["Content-Type"]) {
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
      !whiteList.includes(url) &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const authData = await handleRefreshToken();
      if (authData && authData.access_token) {
        error.config.headers[NO_RETRY_HEADER] = "true";
        error.config.headers[
          "Authorization"
        ] = `Bearer ${authData.access_token}`;
        return instance.request(error.config);
      }
    }

    if (error.config && status === 400 && url === "/api/v1/auth/refresh") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("session");
      message.error("Refresh token is invalid. Please log in again.");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.href = PATH_AUTH.login;
      return Promise.reject(error);
    }

    if (status === 403) {
      message.error(error?.response?.data?.message ?? "");
    }

    return Promise.reject(error?.response?.data?.message);
  }
);

export default instance;
