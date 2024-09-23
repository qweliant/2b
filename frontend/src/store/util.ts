import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useQueryWrapper<T>({
  queryKey,
  queryFn,
  mutateFn,
  editFn,
}: {
  queryKey: string[];
  queryFn: () => Promise<T>;
  mutateFn: (data: T) => Promise<void>;
  editFn: (old: T, newState: T) => T;
}): {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  mutate: (newState: T) => void;
} {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: queryFn,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: mutateFn,
    onMutate: async (newState: T) => {
      await queryClient.cancelQueries({
        queryKey,
      });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: T) => {
        editFn(old, newState);
        console.log("new state", newState);
      });
      return { previousData };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
      console.error(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
  if (error) {
    console.error(error);
  }
  return { data, isLoading, error, mutate };
}

export { useQueryWrapper };
