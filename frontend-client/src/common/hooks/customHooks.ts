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
// import { message } from "antd"
import axios from "axios"

const CustomHooks = {
  useQuery<TData>(
    queryKey: QueryKey,
    queryFn: () => Promise<TData>,
    options?: UseQueryOptions<TData>
  ): UseQueryResult<TData> {
    return useReactQuery<TData>({
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
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): UseMutationResult<TData, TError, TVariables, TContext> {
    return useMutation<TData, TError, TVariables, TContext>({
      mutationFn,
      ...options,
      onError: (error, variables, context, mutation) => {
        if (axios.isAxiosError(error)) {
          const resData = error.response?.data
          //   message.error(resData?.message || "An error occurred")
        }
        options?.onError?.(error, variables, context, mutation)
      },
    })
  },
}

export default CustomHooks
