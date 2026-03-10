import {
  keepPreviousData,
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useQuery as useReactQuery,
} from "@tanstack/react-query"
import axios from "axios"

const CustomHooks = {
  useQuery<
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    queryKey: TQueryKey,
    queryFn: () => Promise<TQueryFnData>,
    options?: Omit<
      UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
      "queryKey" | "queryFn"
    >,
  ): UseQueryResult<TData, TError> {
    return useReactQuery<TQueryFnData, TError, TData, TQueryKey>({
      queryKey,
      queryFn,
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      ...options,
    })
  },

  useMutation<TData, TError = unknown, TVariables = void, TContext = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  ): UseMutationResult<TData, TError, TVariables, TContext> {
    return useMutation<TData, TError, TVariables, TContext>({
      mutationFn,
      ...options,
      onError: (error, variables, context) => {
        if (axios.isAxiosError(error)) {
          const resData = error.response?.data
          console.error("Mutation Error:", resData?.message || error.message)
        }
        if (options?.onError) {
          ;(options.onError as any)(error, variables, context)
        }
      },
    })
  },
}

export default CustomHooks
