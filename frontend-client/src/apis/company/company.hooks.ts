import CustomHooks from "@/common/hooks/customHooks"
import { QUERY_KEYS } from "@/common/queryKeys"
import { useQueryClient } from "@tanstack/react-query"
import { IApiResponse } from "../common/response.types"
import { companyApi } from "./company.api"
import {
  ICompanyDetailRes,
  ICompanyListRes,
  IGetListCompanyReq,
} from "./company.types"

// --- LIST ---
export const useCompanies = (params: IGetListCompanyReq) =>
  CustomHooks.useQuery<IApiResponse<ICompanyListRes>>(
    [QUERY_KEYS.COMPANY_MODULE, "list", params],
    () => companyApi.getList(params)
  )

// --- DETAIL ---
export const useCompanyDetail = (id: number) =>
  CustomHooks.useQuery<IApiResponse<ICompanyDetailRes>>(
    [QUERY_KEYS.COMPANY_MODULE, "detail", id],
    () => companyApi.getById(id)
  )

// --- CREATE ---
export const useCreateCompany = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(companyApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANY_MODULE] })
    },
  })
}

// --- UPDATE ---
export const useUpdateCompany = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(companyApi.update, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANY_MODULE] })
    },
  })
}

// --- DELETE ---
export const useDeleteCompany = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(companyApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANY_MODULE] })
    },
  })
}
