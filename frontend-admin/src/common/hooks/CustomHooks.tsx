import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useQuery as useReactQuery,
} from "@tanstack/react-query"
import { message } from "antd"
import axios from "axios"

const CustomHooks = {
  useQuery<
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: TQueryKey,
    queryFn: () => Promise<TQueryFnData>,
    options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn">
  ): UseQueryResult<TData, TError> {
    return useReactQuery<TQueryFnData, TError, TData, TQueryKey>({
      queryKey,
      queryFn: async () => ensureSuccessfulResponse(await queryFn()),
      refetchOnWindowFocus: false, // 🧠 Không fetch lại khi tab focus
      refetchOnReconnect: false, // 🧠 Không fetch lại khi reconnect
      retry: false,
      ...options,
    })
  },

  useMutation<TData, TError = unknown, TVariables = void, TContext = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): UseMutationResult<TData, TError, TVariables, TContext> {
    return useMutation<TData, TError, TVariables, TContext>({
      mutationFn: async (variables) =>
        ensureSuccessfulResponse(await mutationFn(variables)),
      ...options,
      onError: (error, variables, context) => {
        // The Axios response interceptor already notifies users about 403s.
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          // The shared Axios interceptor already notifies users about 403s.
        } else {
          const resData = axios.isAxiosError(error) ? error.response?.data : undefined
          message.error(resData?.message || (error instanceof Error ? error.message : "An error occurred"))
        }
        options?.onError?.(error, variables, context)
      },
    })
  },
}

function ensureSuccessfulResponse<T>(response: T): T {
  if (
    response &&
    typeof response === "object" &&
    "statusCode" in response &&
    typeof response.statusCode === "number" &&
    response.statusCode >= 400
  ) {
    const apiError = new Error(
      "message" in response && typeof response.message === "string"
        ? response.message
        : "The request failed",
    )
    Object.assign(apiError, { statusCode: response.statusCode })
    throw apiError
  }
  return response
}

export default CustomHooks
