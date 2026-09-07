import api from "../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
             
function useMutateQuery({ method, url, queryKey, data }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (urls) => {
      const response = await api({
        method,
        url:urls||url,
        data,
      });

      return response.data;
    },

    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({
          queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        });
      }
    },
  });

  return {
    mutate,
    isPending,
    error,
  };
}

export default useMutateQuery;
