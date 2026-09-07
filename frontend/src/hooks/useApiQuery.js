import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
function useApiQuery(url, queryKey,retry) {
  const { isLoading, error, data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await api.get(url);
      return response.data;
    },
    retry: retry||false,
  });
  return { isLoading, error, data };
}

export default useApiQuery;
