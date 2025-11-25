import { API_PATHS } from "@/common/apiPaths"

import { fetchWithAuth } from "@/common/hooks/fetchWithAuth"
import { IApiResponse } from "../common/response.types"
import {
  ICompany,
  ICompanyDetailRes,
  ICompanyListRes,
  IGetListCompanyReq,
} from "./company.types"

export const companyApi = {
  getList: (params: IGetListCompanyReq) =>
    fetchWithAuth<IApiResponse<ICompanyListRes>>(API_PATHS.COMPANY, {
      method: "GET",
      params,
    }),

  getById: (id: number) =>
    fetchWithAuth<IApiResponse<ICompanyDetailRes>>(
      `${API_PATHS.COMPANY}/${id}`,
      {
        method: "GET",
      }
    ),

  create: (data: Partial<ICompany>) =>
    fetchWithAuth<IApiResponse<ICompanyDetailRes>>(API_PATHS.COMPANY, {
      method: "POST",
      data,
    }),

  update: (data: Partial<ICompany>) =>
    fetchWithAuth<IApiResponse<ICompanyDetailRes>>(API_PATHS.COMPANY, {
      method: "PUT",
      data,
    }),

  delete: (id: number) =>
    fetchWithAuth<IApiResponse<boolean>>(`${API_PATHS.COMPANY}/${id}`, {
      method: "DELETE",
    }),
}
