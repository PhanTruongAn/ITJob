import axiosInstance from "../config/axios"
import {
  IBackendPaginateRes,
  IBackendRes,
  IJobRecommendation,
} from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function fetchJobRecommendations(params: {
  page?: number
  pageSize?: number
  subscriberId?: number
}): Promise<IBackendPaginateRes<IJobRecommendation[]>> {
  const response = await axiosInstance.get<
    IBackendPaginateRes<IJobRecommendation[]>
  >(`${PATH_API.recommendation.root}/jobs`, {
    params: {
      page: params.page ? params.page - 1 : 0,
      size: params.pageSize,
      subscriberId: params.subscriberId,
    },
  })
  return response.data
}

export async function updateRecommendationStatus(
  id: number,
  status: string,
): Promise<IBackendRes<IJobRecommendation>> {
  const response = await axiosInstance.patch<IBackendRes<IJobRecommendation>>(
    `${PATH_API.recommendation.root}/jobs/${id}/status?status=${status}`,
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
    `${PATH_API.recommendation.root}/jobs/generate`,
  )
  return response.data
}

export async function fetchRecommendationConfig(): Promise<
  IBackendRes<{
    cronExpression: string
    isEnabled: boolean
    minMatchPercentage: number
    onlyLast24h: boolean
    maxJobsPerSubscriber: number
  }>
> {
  const response = await axiosInstance.get<IBackendRes<any>>(
    `${PATH_API.recommendation.root}/config`,
  )
  return response.data
}

export async function updateRecommendationConfig(data: {
  cronExpression: string
  isEnabled: boolean
  minMatchPercentage: number
  onlyLast24h: boolean
  maxJobsPerSubscriber: number
}): Promise<IBackendRes<any>> {
  const response = await axiosInstance.patch<IBackendRes<any>>(
    `${PATH_API.recommendation.root}/config`,
    data,
  )
  return response.data
}
