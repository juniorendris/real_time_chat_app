import useApiQuery from "./useApiQuery";
function useGetOutgoing() {
  const {
    isLoading: outgoingLoading,
    error,
    data: sentRequest,
  } = useApiQuery("/user/friend-request/outgoing", "request");
  return { outgoingLoading, error, sentRequest };
}
export default useGetOutgoing;
