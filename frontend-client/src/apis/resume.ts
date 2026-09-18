import axiosInstance from "@/configs/axiosInstance"
import { IBackendRes, ICreateResumeReq, IResume } from "@/types/backend"

export async function applyJob(data: ICreateResumeReq): Promise<IBackendRes<IResume>> {
  const response = await axiosInstance.post<IBackendRes<IResume>>(
    "/api/v1/resumes/by-user",
    data
  )
  return response.data
}

export async function getMyResumes(): Promise<IBackendRes<IResume[]>> {
  const response = await axiosInstance.get<IBackendRes<IResume[]>>(
    "/api/v1/resumes/by-user"
  )
  return response.data
}

export async function checkJobApplied(jobId: number): Promise<IBackendRes<IResume>> {
  const response = await axiosInstance.get<IBackendRes<IResume>>(
    `/api/v1/resumes/check-applied`,
    {
      params: { jobId },
    }
  )
  return response.data
}
