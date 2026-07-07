import CustomHooks from "@/common/hooks/customHooks"
import { QUERY_KEYS } from "@/common/queryKeys"
import { useQueryClient } from "@tanstack/react-query"
import { IApiResponse, IPaginatedData } from "../common/response.types"
import { ICompanyReview, ICreateReviewReq, reviewApi } from "./review.api"

export const useCompanyReviews = (companyId: number, page: number, size: number) =>
  CustomHooks.useQuery<IApiResponse<IPaginatedData<ICompanyReview>>>(
    [QUERY_KEYS.REVIEW_MODULE, "list", companyId, page, size],
    () => reviewApi.getReviewsByCompany(companyId, page, size)
  )

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation<IApiResponse<ICompanyReview>, unknown, ICreateReviewReq>(
    (data: ICreateReviewReq) => reviewApi.createReview(data),
    {
      onSuccess: () => {
        // Invalidate reviews query so the list refreshes
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.REVIEW_MODULE],
        })
        // Invalidate company details to refresh averages/rating count
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.COMPANY_MODULE],
        })
      },
    }
  )
}
