import useApiQuery from "./useApiQuery";

function useGetIncomming() {
  const { isLoading, error, data } = useApiQuery(
    "/user/friend-request",
    "/friend-request",
  );
  return { isLoading, error, data };
}
export default useGetIncomming;
