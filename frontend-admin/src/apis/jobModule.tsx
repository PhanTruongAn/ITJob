import axiosInstance from "../config/axios"
import { ICreateJobReq, IEditJobDTO, IJob } from "../page/job/common/interfaces"
import { IBackendRes } from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function createJob(
  data: ICreateJobReq
): Promise<IBackendRes<IJob>> {
  const response = await axiosInstance.post<IBackendRes<IJob>>(
    `${PATH_API.job.root}`,
    data
  )
  return response.data
}

export async function deleteJob({
  id,
}: {
  id: number
}): Promise<IBackendRes<IJob>> {
  const response = await axiosInstance.delete<IBackendRes<IJob>>(
    `${PATH_API.job.root}/${id}`
  )
  return response.data
}

export async function getJobById(id: number): Promise<IBackendRes<IJob>> {
  const response = await axiosInstance.get<IBackendRes<IJob>>(
    `${PATH_API.job.root}/${id}`
  )
  return response.data
}

export async function editJob(data: IEditJobDTO): Promise<IBackendRes<IJob>> {
  const response = await axiosInstance.put<IBackendRes<IJob>>(
    `${PATH_API.job.root}`,
    data
  )
  return response.data
}
