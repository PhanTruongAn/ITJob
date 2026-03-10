import axiosInstance from "../config/axios"
import { IBackendPaginateRes, IBackendRes, IPermission } from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function fetchPermissions(params: {
  page?: number
  pageSize?: number
}): Promise<IBackendPaginateRes<IPermission[]>> {
  const q = new URLSearchParams()
  if (params.page) q.append("page", params.page.toString())
  if (params.pageSize) q.append("size", params.pageSize.toString())

  const response = await axiosInstance.get<IBackendPaginateRes<IPermission[]>>(
    `${PATH_API.permission.root}?${q.toString()}`
  )
  return response.data
}

export async function createPermission(
  data: Omit<IPermission, "id">
): Promise<IBackendRes<IPermission>> {
  const response = await axiosInstance.post<IBackendRes<IPermission>>(
    PATH_API.permission.root,
    data
  )
  return response.data
}

export async function updatePermission(
  data: IPermission
): Promise<IBackendRes<IPermission>> {
  const response = await axiosInstance.put<IBackendRes<IPermission>>(
    PATH_API.permission.root,
    data
  )
  return response.data
}

export async function deletePermission({ id }: { id: number }) {
  const response = await axiosInstance.delete<IBackendRes<any>>(
    `${PATH_API.permission.root}/${id}`
  )
  return response.data
}
export async function fetchResources(): Promise<IBackendRes<any[]>> {
  const response = await axiosInstance.get<IBackendRes<any[]>>(
    `${PATH_API.permission.root}/resources`
  )
  return response.data
}

export async function fetchActions(): Promise<IBackendRes<any[]>> {
  const response = await axiosInstance.get<IBackendRes<any[]>>(
    `${PATH_API.permission.root}/actions`
  )
  return response.data
}
