import { API_PATHS } from "@/common/apiPaths"
import { fetchWithAuth } from "@/common/hooks/fetchWithAuth"
import { IApiResponse } from "../common/response.types"
import { IProfileRes, IUpdateProfileReq } from "./profile.types"

export const profileApi = {
  update: (data: IUpdateProfileReq) =>
    fetchWithAuth<IApiResponse<IProfileRes>>(`${API_PATHS.PROFILE}`, {
      method: "PUT",
      data,
    }),
}
