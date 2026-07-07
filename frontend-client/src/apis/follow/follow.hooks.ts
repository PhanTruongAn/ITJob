import CustomHooks from "@/common/hooks/customHooks"
import { QUERY_KEYS } from "@/common/queryKeys"
import { useQueryClient } from "@tanstack/react-query"
import { followApi, IFollowResponse } from "./follow.api"
import { IApiResponse } from "../common/response.types"

export const useFollowStatus = (companyId: number, enabled: boolean = true) =>
  CustomHooks.useQuery<IApiResponse<boolean>>(
    [QUERY_KEYS.FOLLOW_MODULE, "status", companyId],
    () => followApi.getStatus(companyId),
    { enabled }
  )

export const useToggleFollowCompany = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation<IApiResponse<IFollowResponse>, unknown, number>(
    (companyId: number) => followApi.toggleFollow(companyId),
    {
      onSuccess: (_, companyId) => {
        // Invalidate both follow status and follow lists
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.FOLLOW_MODULE, "status", companyId],
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.FOLLOW_MODULE, "list"],
        })
      },
    }
  )
}
