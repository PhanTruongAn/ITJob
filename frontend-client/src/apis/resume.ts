import axiosInstance from "@/configs/axiosInstance"
import { IBackendRes, ICreateResumeReq, IResume } from "@/types/backend"
import { PATH_API } from "./constants/apiPath"

export async function applyJob(
  data: ICreateResumeReq,
): Promise<IBackendRes<IResume>> {
  const response = await axiosInstance.post<IBackendRes<IResume>>(
    `${PATH_API.resume.root}/by-user`,
    data,
  )
  return response.data
}

export async function getMyResumes(): Promise<IBackendRes<IResume[]>> {
  const response = await axiosInstance.get<IBackendRes<IResume[]>>(
    `${PATH_API.resume.root}/by-user`,
  )
  return response.data
}

export async function checkJobApplied(
  jobId: number,
): Promise<IBackendRes<IResume>> {
  const response = await axiosInstance.get<IBackendRes<IResume>>(
    `${PATH_API.resume.root}/check-applied`,
    {
      params: { jobId },
    },
  )
  return response.data
}
