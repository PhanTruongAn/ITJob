import axiosInstance from "../config/axios"
import {
  IBackendPaginateRes,
  IBackendRes,
  IJobRecommendation,
} from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export interface JobRecommendationFilter {
  page?: number
  pageSize?: number
  subscriberId?: number
  companyId?: number
  emailStatus?: string
  keyword?: string
  fromDate?: string // ISO string
  toDate?: string // ISO string
  minMatch?: number
}

export async function fetchJobRecommendations(
  params: JobRecommendationFilter,
): Promise<IBackendPaginateRes<IJobRecommendation[]>> {
  const response = await axiosInstance.get<
    IBackendPaginateRes<IJobRecommendation[]>
  >(`${PATH_API.recommendation.root}/jobs`, {
    params: {
      page: params.page ? params.page - 1 : 0,
      size: params.pageSize,
      subscriberId: params.subscriberId || undefined,
      companyId: params.companyId || undefined,
      emailStatus: params.emailStatus || undefined,
      keyword: params.keyword || undefined,
      fromDate: params.fromDate || undefined,
      toDate: params.toDate || undefined,
      minMatch: params.minMatch || undefined,
    },
  })
  return response.data
}

export async function fetchJobRecommendationById(
  id: number,
): Promise<IBackendRes<IJobRecommendation>> {
  const response = await axiosInstance.get<IBackendRes<IJobRecommendation>>(
    `${PATH_API.recommendation.root}/jobs/${id}`,
  )
  return response.data
}

export async function updateEmailStatus(
  id: number,
  emailStatus: string,
): Promise<IBackendRes<IJobRecommendation>> {
  const response = await axiosInstance.patch<IBackendRes<IJobRecommendation>>(
    `${PATH_API.recommendation.root}/jobs/${id}/email-status?email-status=${emailStatus}`,
  )
  return response.data
}

export async function deleteRecommendation(
  id: number,
): Promise<IBackendRes<any>> {
  const response = await axiosInstance.delete<IBackendRes<any>>(
    `${PATH_API.recommendation.root}/jobs/${id}`,
  )
  return response.data
}

export async function generateRecommendations(): Promise<IBackendRes<any>> {
  const response = await axiosInstance.post<IBackendRes<any>>(
    `${PATH_API.recommendation.root}/generate`,
  )
  return response.data
}

export async function fetchRecommendationConfig(): Promise<IBackendRes<any>> {
  const response = await axiosInstance.get<IBackendRes<any>>(
    `${PATH_API.recommendation.root}/config`,
  )
  return response.data
}

export async function updateRecommendationConfig(
  data: any,
): Promise<IBackendRes<any>> {
  const response = await axiosInstance.put<IBackendRes<any>>(
    `${PATH_API.recommendation.root}/config`,
    data,
  )
  return response.data
}
