import axiosInstance from "@/configs/axiosInstance"
import { IBackendRes, IFile } from "@/types/backend"

export async function uploadCv(file: File): Promise<IBackendRes<IFile>> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await axiosInstance.post<IBackendRes<IFile>>(
    "/api/v1/file/cvs/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )
  return response.data
}

export async function getUserCvs(): Promise<IBackendRes<IFile[]>> {
  const response = await axiosInstance.get<IBackendRes<IFile[]>>(
    "/api/v1/file/cvs",
  )
  return response.data
}

export async function setDefaultCv(fileId: number): Promise<IBackendRes<IFile>> {
  const response = await axiosInstance.put<IBackendRes<IFile>>(
    `/api/v1/file/cvs/${fileId}/default`,
  )
  return response.data
}

export async function deleteCv(fileId: number): Promise<IBackendRes<boolean>> {
  const response = await axiosInstance.delete<IBackendRes<boolean>>(
    `/api/v1/file/cvs/${fileId}`,
  )
  return response.data
}
