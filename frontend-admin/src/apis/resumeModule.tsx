import axiosInstance from "../config/axios"
import { IBackendPaginateRes, IBackendRes, IResume } from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function fetchResumes(params: {
  page?: number
  pageSize?: number
}): Promise<IBackendPaginateRes<IResume[]>> {
  const q = new URLSearchParams()
  if (params.page) q.append("page", params.page.toString())
  if (params.pageSize) q.append("size", params.pageSize.toString())

  const response = await axiosInstance.get<IBackendPaginateRes<IResume[]>>(
    `${PATH_API.resume.root}?${q.toString()}`
  )
  return response.data
}

export async function deleteResume({ id }: { id: number }) {
  const response = await axiosInstance.delete<IBackendRes<any>>(
    `${PATH_API.resume.root}/${id}`
  )
  return response.data
}

export async function approveResume(id: number) {
  const response = await axiosInstance.put<IBackendRes<IResume>>(
    `${PATH_API.resume.root}/${id}/approve`
  )
  return response.data
}

export async function reviewResume(id: number) {
  const response = await axiosInstance.put<IBackendRes<IResume>>(
    `${PATH_API.resume.root}/${id}/review`
  )
  return response.data
}

export async function rejectResume(id: number, note?: string) {
  const q = new URLSearchParams()
  if (note) q.append("note", note)
  const response = await axiosInstance.put<IBackendRes<IResume>>(
    `${PATH_API.resume.root}/${id}/reject?${q.toString()}`
  )
  return response.data
}
