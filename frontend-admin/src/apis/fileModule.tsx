import { IBackendRes, ICloud } from "../types/backend";
import axiosInstance from "../config/axios";
import axios from "axios";
import { PATH_API } from "./constants/apiPath";

export async function signedUploadLogo(): Promise<IBackendRes<ICloud>> {
  const response = await axiosInstance.get<IBackendRes<ICloud>>(
    `${PATH_API.file.sign}`
  );
  return response.data;
}
