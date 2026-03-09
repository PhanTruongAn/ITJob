import axiosInstance from "../config/axios"
import { SkillOptions } from "../page/job/common/interfaces"
import { IBackendPaginateRes, IBackendRes, ISkill } from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function fetchSkillOptions(): Promise<
  IBackendRes<SkillOptions[]>
> {
  const response = await axiosInstance.get<IBackendRes<SkillOptions[]>>(
    `${PATH_API.skill.root}/options`
  )
  return response.data
}

export async function fetchSkills(params: {
  page?: number
  pageSize?: number
  sort?: string
  name?: string
}): Promise<IBackendPaginateRes<ISkill[]>> {
  const q = new URLSearchParams()
  if (params.page) q.append("page", params.page.toString())
  if (params.pageSize) q.append("size", params.pageSize.toString())
  if (params.sort) q.append("sort", params.sort)
  if (params.name) q.append("name", params.name)

  const response = await axiosInstance.get<IBackendPaginateRes<ISkill[]>>(
    `${PATH_API.skill.root}?${q.toString()}`
  )
  return response.data
}

export async function createSkill(
  data: Omit<ISkill, "id">
): Promise<IBackendRes<ISkill>> {
  const response = await axiosInstance.post<IBackendRes<ISkill>>(
    PATH_API.skill.root,
    data
  )
  return response.data
}

export async function updateSkill(data: ISkill): Promise<IBackendRes<ISkill>> {
  const response = await axiosInstance.put<IBackendRes<ISkill>>(
    PATH_API.skill.root,
    data
  )
  return response.data
}

export async function deleteSkill({ id }: { id: number }) {
  const response = await axiosInstance.delete<IBackendRes<any>>(
    `${PATH_API.skill.root}/${id}`
  )
  return response.data
}

export async function getSkillById({ id }: { id: number }) {
  const response = await axiosInstance.get<IBackendRes<ISkill>>(
    `${PATH_API.skill.root}/${id}`
  )
  return response.data
}
