import useApiQuery from "./useApiQuery"


const useGetFriends = () => {
  const { isLoading, data, error } = useApiQuery("/user/friends", "/friends",true);
  return { isLoading, data, error };
};

export default useGetFriends;