import {
  useQuery as useReactQuery,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";

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
      ...options,
    });
  },

  useMutation<TData, TError = unknown, TVariables = void, TContext = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): UseMutationResult<TData, TError, TVariables, TContext> {
    return useMutation<TData, TError, TVariables, TContext>({
      mutationFn,
      ...options,
      onError: (error, variables, context) => {
        if (axios.isAxiosError(error)) {
          const resData = error.response?.data;
          message.error(resData?.error || resData?.message);
        }
        options?.onError?.(error, variables, context);
      },
    });
  },
};

export default CustomHooks;
