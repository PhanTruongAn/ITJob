import axios from "../config/axios"
import { IBackendRes, IUserProfile } from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export interface UpdateProfileRequest {
  name: string
  phone: string | null
  address: string | null
  gender: string | null
  avatar: string | null
  dob: string | null
}

export async function fetchProfile(): Promise<IBackendRes<IUserProfile | null>> {
  const response = await axios.get<IBackendRes<IUserProfile | null>>(
    PATH_API.profile.root,
  )
  return response.data
}

export async function updateProfile(
  data: UpdateProfileRequest,
): Promise<IBackendRes<IUserProfile>> {
  const response = await axios.put<IBackendRes<IUserProfile>>(
    PATH_API.profile.root,
    data,
  )
  return response.data
}

export async function changePassword(data: {
  oldPassword: string
  newPassword: string
}): Promise<IBackendRes<null>> {
  const response = await axios.put<IBackendRes<null>>(
    PATH_API.profile.changePassword,
    data,
  )
  return response.data
}
