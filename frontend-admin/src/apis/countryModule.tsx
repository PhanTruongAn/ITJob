import { IBackendRes, ICountry } from "../types/backend";
import axiosInstance from "../config/axios";
import { PATH_API } from "./constants/apiPath";
export async function fetchCountries(): Promise<IBackendRes<ICountry[]>> {
  const response = await axiosInstance.get<IBackendRes<ICountry[]>>(
    `${PATH_API.country.root}`
  );
  return response.data;
}
