import axiosInstance from "../config/axios"
import { SkillOptions } from "../page/job/common/interfaces"
import { IBackendRes } from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function fetchSkillOptions(): Promise<
  IBackendRes<SkillOptions[]>
> {
  const response = await axiosInstance.get<IBackendRes<SkillOptions[]>>(
    `${PATH_API.skill.root}/options`
  )
  return response.data
}
