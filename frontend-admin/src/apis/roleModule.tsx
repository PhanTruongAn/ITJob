import axiosInstance from "../config/axios"
import { IBackendPaginateRes, IBackendRes, IRole } from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function fetchRoles(params: {
  page?: number
  pageSize?: number
}): Promise<IBackendPaginateRes<IRole[]>> {
  const q = new URLSearchParams()
  if (params.page) q.append("page", params.page.toString())
  if (params.pageSize) q.append("size", params.pageSize.toString())

  const response = await axiosInstance.get<IBackendPaginateRes<IRole[]>>(
    `${PATH_API.role.root}?${q.toString()}`
  )
  return response.data
}

export async function createRole(
  data: Omit<IRole, "id">
): Promise<IBackendRes<IRole>> {
  const response = await axiosInstance.post<IBackendRes<IRole>>(
    PATH_API.role.root,
    data
  )
  return response.data
}

export async function updateRole(
  data: IRole
): Promise<IBackendRes<IRole>> {
  const response = await axiosInstance.put<IBackendRes<IRole>>(
    PATH_API.role.root,
    data
  )
  return response.data
}

export async function deleteRole({ id }: { id: number }) {
  const response = await axiosInstance.delete<IBackendRes<any>>(
    `${PATH_API.role.root}/${id}`
  )
  return response.data
}

export async function getRoleById(id: number): Promise<IBackendRes<IRole>> {
  const response = await axiosInstance.get<IBackendRes<IRole>>(
    `${PATH_API.role.root}/${id}`
  )
  return response.data
}

export async function assignPermissions(data: {
  roleId: number
  permissionIds: number[]
}) {
  const response = await axiosInstance.post(
    `${PATH_API.role.root}/assign-permissions`,
    data
  )
  return response.data
}
