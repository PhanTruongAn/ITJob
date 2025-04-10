import {
  useQuery as useReactQuery,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

const CustomHooks = {
  useQuery<TData>(
    queryKey: QueryKey,
    queryFn: () => Promise<TData>,
    options?: UseQueryOptions<TData>
  ): UseQueryResult<TData> {
    return useReactQuery<TData>({
      queryKey,
      queryFn,
      refetchOnWindowFocus: false,
      staleTime: 1000,
      ...options,
    });
  },
};

export default CustomHooks;
