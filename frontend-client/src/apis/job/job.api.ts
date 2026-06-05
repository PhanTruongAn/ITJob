import { API_PATHS } from "@/common/apiPaths"
import { fetchWithAuth } from "@/common/hooks/fetchWithAuth"
import { IApiResponse } from "../common/response.types"
import { IGetListJobReq, IJob, IJobListRes } from "./job.types"

export const jobApi = {
  getList: (params: IGetListJobReq) =>
    fetchWithAuth<IApiResponse<IJobListRes>>(API_PATHS.JOB, {
      method: "GET",
      params,
    }),

  getById: (id: number) =>
    fetchWithAuth<IApiResponse<IJob>>(`${API_PATHS.JOB}/${id}`, {
      method: "GET",
    }),
}
