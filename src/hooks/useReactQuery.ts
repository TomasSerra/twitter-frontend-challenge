import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
  MutationFunction,
} from "@tanstack/react-query";

export function useApiQuery<T>(queryKey: string[], queryFn: () => Promise<T>) {
  return useQuery<T>({
    queryKey,
    queryFn,
  });
}

export function useApiMutation<T>(
  mutationFn: MutationFunction<T>,
  invalidateQuery: boolean = true,
  invalidateQueryKeys: string[] = [],
  options?: UseMutationOptions<T>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      if (invalidateQuery) {
        queryClient.invalidateQueries({ queryKey: invalidateQueryKeys });
      }
    },
    ...options,
  });
}
