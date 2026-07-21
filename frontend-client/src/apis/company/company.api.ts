import { API_PATHS } from "@/common/apiPaths"
import { fetchPublic } from "@/common/hooks/fetchPublic"
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
    fetchPublic<IApiResponse<ICompanyListRes>>(API_PATHS.COMPANY, {
      method: "GET",
      params,
    }),

  getById: (id: number) =>
    fetchPublic<IApiResponse<ICompanyDetailRes>>(
      `${API_PATHS.COMPANY}/${id}`,
      {
        method: "GET",
      }
    ),

  create: (data: Partial<ICompany>) =>
    fetchWithAuth<IApiResponse<ICompanyDetailRes>>("/api/v1/companies", {
      method: "POST",
      data,
    }),

  update: (data: Partial<ICompany>) =>
    fetchWithAuth<IApiResponse<ICompanyDetailRes>>("/api/v1/companies", {
      method: "PUT",
      data,
    }),

  delete: (id: number) =>
    fetchWithAuth<IApiResponse<boolean>>(`/api/v1/companies/${id}`, {
      method: "DELETE",
    }),
}
