
// import React from 'react'
import useMutateQuery from "./useMutateQuery";
function useDeleteRequest() {
  const { mutate, isPending, error } = useMutateQuery({
    method: "DELETE",
    queryKey: "request",
  });

  return { mutate, isPending, error };
}

export default useDeleteRequest;
