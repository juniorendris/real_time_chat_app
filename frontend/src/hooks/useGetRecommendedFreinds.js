import useApiQuery from "./useApiQuery";

const useGetRecommendedFreinds=()=>{
    const {isLoading,data,error}=useApiQuery('/user','user',true);
    // console.log(data);
    return {isLoading,data,error};
}
export default useGetRecommendedFreinds;