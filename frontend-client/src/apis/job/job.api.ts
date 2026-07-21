import { API_PATHS } from "@/common/apiPaths"
import { fetchPublic } from "@/common/hooks/fetchPublic"
import { IApiResponse } from "../common/response.types"
import { IGetListJobReq, IJob, IJobListRes } from "./job.types"

export const jobApi = {
  getList: (params: IGetListJobReq) =>
    fetchPublic<IApiResponse<IJobListRes>>(API_PATHS.JOB, {
      method: "GET",
      params,
    }),

  getById: (id: number) =>
    fetchPublic<IApiResponse<IJob>>(`${API_PATHS.JOB}/${id}`, {
      method: "GET",
    }),
}
