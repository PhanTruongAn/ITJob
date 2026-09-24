import axiosPublic from "@/configs/axiosPublic"
import { IBackendPaginateRes, IBackendRes, IJob } from "@/types/backend"
import { PATH_API } from "./constants/apiPath"

interface FetchJobsParams {
  page?: number
  pageSize?: number
  name?: string
  companyId?: number
  level?: string
  levels?: string[]
  jobType?: string
  jobTypes?: string[]
  location?: string
  minSalary?: number
  maxSalary?: number
  skillId?: number
  skillIds?: number[]
  sortBy?: string
}

export async function fetchJobs(
  params: FetchJobsParams,
): Promise<IBackendPaginateRes<IJob[]>> {
  const response = await axiosPublic.get<IBackendPaginateRes<IJob[]>>(
    PATH_API.job.root,
    {
      params: {
        page: params.page,
        size: params.pageSize,
        name: params.name || undefined,
        companyId: params.companyId || undefined,
        level: params.level || undefined,
        levels: params.levels && params.levels.length > 0 ? params.levels : undefined,
        jobType: params.jobType || undefined,
        jobTypes: params.jobTypes && params.jobTypes.length > 0 ? params.jobTypes : undefined,
        location: params.location || undefined,
        minSalary: params.minSalary || undefined,
        maxSalary: params.maxSalary || undefined,
        skillId: params.skillId || undefined,
        skillIds: params.skillIds && params.skillIds.length > 0 ? params.skillIds : undefined,
        sortBy: params.sortBy || undefined,
      },
    },
  )
  return response.data
}


export async function getJobById(id: number): Promise<IBackendRes<IJob>> {
  const response = await axiosPublic.get<IBackendRes<IJob>>(
    `${PATH_API.job.root}/${id}`,
  )
  return response.data
}

export async function getJobLatest(): Promise<IBackendRes<IJob[]>> {
  const response = await axiosPublic.get<IBackendRes<IJob[]>>(
    `${PATH_API.job.root}/latest`,
  )
  return response.data
}
