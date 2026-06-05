import CustomHooks from "@/common/hooks/customHooks"
import { QUERY_KEYS } from "@/common/queryKeys"
import { IApiResponse } from "../common/response.types"
import { jobApi } from "./job.api"
import { IGetListJobReq, IJobListRes } from "./job.types"

export const useJobs = (params: IGetListJobReq) =>
  CustomHooks.useQuery<IApiResponse<IJobListRes>>(
    [QUERY_KEYS.JOB_MODULE, "list", params],
    () => jobApi.getList(params)
  )
