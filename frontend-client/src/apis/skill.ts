import axiosPublic from "@/configs/axiosPublic"
import { IBackendRes, ISkill } from "@/types/backend"
import { PATH_API } from "./constants/apiPath"

export async function getPublicSkills(): Promise<IBackendRes<ISkill[]>> {
  const response = await axiosPublic.get<IBackendRes<ISkill[]>>(
    PATH_API.skill.root,
  )
  return response.data
}
