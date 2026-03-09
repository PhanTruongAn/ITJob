import { IBackendRes, ICountry } from "../types/backend";
import axiosInstance from "../config/axios";
import { PATH_API } from "./constants/apiPath";

export async function fetchCountries(): Promise<IBackendRes<ICountry[]>> {
  const response = await axiosInstance.get<IBackendRes<ICountry[]>>(
    `${PATH_API.country.root}`
  );
  return response.data;
}

export async function createCountry(
  data: Omit<ICountry, "id">
): Promise<IBackendRes<ICountry>> {
  const response = await axiosInstance.post<IBackendRes<ICountry>>(
    PATH_API.country.root,
    data
  )
  return response.data
}

export async function updateCountry(data: ICountry): Promise<IBackendRes<ICountry>> {
  const response = await axiosInstance.put<IBackendRes<ICountry>>(
    PATH_API.country.root,
    data
  )
  return response.data
}

export async function deleteCountry({ id }: { id: number }) {
  const response = await axiosInstance.delete<IBackendRes<any>>(
    `${PATH_API.country.root}/${id}`
  )
  return response.data
}
