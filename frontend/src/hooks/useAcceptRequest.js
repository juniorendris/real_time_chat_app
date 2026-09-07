// import React from 'react'
import useMutateQuery from "./useMutateQuery";
function useAcceptRequest() {
  const { mutate, isPending, error } = useMutateQuery({
    method: "POST",
    queryKey: "accepted_friendRequest",
  });

  return { mutate, isPending, error };
}

export default useAcceptRequest;
