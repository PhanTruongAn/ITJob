import axiosInstance from "../config/axios"
import {
  CreateJobReqDTO,
  EditJobReqDTO,
  GetListJobResDTO,
  Job,
} from "../page/job/common/interfaces"

import { IBackendPaginateRes, IBackendRes } from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function fetchJobs({
  page,
  pageSize,
  sort,
  name,
  companyId,
  level,
  location,
  maxSalary,
  minSalary,
  skillId,
}: GetListJobResDTO): Promise<IBackendPaginateRes<Job[]>> {
  const response = await axiosInstance.get<IBackendPaginateRes<Job[]>>(
    `${PATH_API.job.root}`,
    {
      params: {
        page: page,
        size: pageSize,
        name: name,
        companyId: companyId,
        level: level,
        location: location,
        maxSalary: maxSalary,
        minSalary: minSalary,
        skillId: skillId,
        ...(sort && { sort: sort }),
      },
    }
  )
  return response.data
}

export async function createJob(
  data: CreateJobReqDTO
): Promise<IBackendRes<Job>> {
  const response = await axiosInstance.post<IBackendRes<Job>>(
    `${PATH_API.job.root}`,
    data
  )
  return response.data
}

export async function deleteJob({
  id,
}: {
  id: number
}): Promise<IBackendRes<Job>> {
  const response = await axiosInstance.delete<IBackendRes<Job>>(
    `${PATH_API.job.root}/${id}`
  )
  return response.data
}

export async function getJobById(id: number): Promise<IBackendRes<Job>> {
  const response = await axiosInstance.get<IBackendRes<Job>>(
    `${PATH_API.job.root}/${id}`
  )
  return response.data
}

export async function editJob(data: EditJobReqDTO): Promise<IBackendRes<Job>> {
  const response = await axiosInstance.put<IBackendRes<Job>>(
    `${PATH_API.job.root}`,
    data
  )
  return response.data
}
