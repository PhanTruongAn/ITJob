import axiosInstance from "@/configs/axiosInstance"
import { IBackendPaginateRes, IBackendRes, IJob } from "@/types/backend"
import { PATH_API } from "./constants/apiPath"

interface FetchJobsParams {
  page?: number
  pageSize?: number
  name?: string
  companyId?: number
  level?: string
  location?: string
  minSalary?: number
  maxSalary?: number
  skillId?: number
  sort?: string
}

export async function fetchJobs(
  params: FetchJobsParams,
): Promise<IBackendPaginateRes<IJob[]>> {
  const response = await axiosInstance.get<IBackendPaginateRes<IJob[]>>(
    PATH_API.job.root,
    {
      params: {
        page: params.page,
        size: params.pageSize,
        name: params.name,
        companyId: params.companyId,
        level: params.level,
        location: params.location,
        minSalary: params.minSalary,
        maxSalary: params.maxSalary,
        skillId: params.skillId,
        sort: params.sort,
      },
    },
  )
  return response.data
}

export async function getJobById(id: number): Promise<IBackendRes<IJob>> {
  const response = await axiosInstance.get<IBackendRes<IJob>>(
    `${PATH_API.job.root}/${id}`,
  )
  return response.data
}
