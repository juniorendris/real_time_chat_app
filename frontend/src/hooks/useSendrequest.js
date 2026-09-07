// import React from 'react'
import useMutateQuery from "./useMutateQuery";
function useSendrequest() {
  const { mutate, isPending, error } = useMutateQuery({
    method: "POST",
    queryKey: "request",
  });

  return { mutate, isPending, error };
}

export default useSendrequest;
