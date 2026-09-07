import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
function useGetChatToken(authUser) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["/chat/token"],
    queryFn: async () => {
      const response = await api.get("/chat/token");
      return response.data;
    },
    enabled: !!authUser,
    retry: true,
  });
  return {data };
}

export default useGetChatToken;
