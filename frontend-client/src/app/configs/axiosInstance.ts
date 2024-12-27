import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const axiosInstance = axios.create({
  baseURL: backendUrl,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
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
