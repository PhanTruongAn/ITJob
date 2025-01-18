import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const axiosInstance = axios.create({
  baseURL: backendUrl,
  timeout: 3000,
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response;
  },
  function (error) {
    return error.response.data;
    // return Promise.reject(error);
  }
);

export default axiosInstance;
