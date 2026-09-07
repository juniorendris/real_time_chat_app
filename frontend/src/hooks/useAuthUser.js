import useApiQuery from "./useApiQuery.js";

const useAuthUser = () => {
  const { isLoading, data, error } = useApiQuery("/user/authUser", "/authuser");
  //  console.log(data);
  return { isLoading, data, error };
};
export default useAuthUser;
