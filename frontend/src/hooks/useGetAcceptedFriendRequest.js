import useApiQuery from "./useApiQuery";

function useGetAcceptedFriendRequest() {
  const {
    isLoading: fetchingAcceptedFriendRequest,
    data: friendRecently,
    error,
  } = useApiQuery(
    "/user/accepted-friend-request",
    "/accepted-friend-request",
    true,
  );
  return { fetchingAcceptedFriendRequest, friendRecently, error };
}

export default useGetAcceptedFriendRequest;
     