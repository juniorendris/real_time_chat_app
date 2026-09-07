import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, Flag, X } from "lucide-react";
import toast from "react-hot-toast";

import useGetOutgoing from "../hooks/useGetOutgoing";
import useDeleteRequest from "../hooks/useDeleteRequest";
import FriendCardSkeleton from "../components/FriendCardSkeleton";

function RequestsPage() {
  const queryClient = useQueryClient();

  const [pending, setPending] = useState(null);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  const { outgoingLoading, sentRequest } = useGetOutgoing();
  const { mutate } = useDeleteRequest();

  useEffect(() => {
    setOutgoingRequests(sentRequest?.outGoingRequets ?? []);
  }, [sentRequest]);

  const cancelRequest = (receiverId) => {
    setPending(receiverId);

    mutate(`/user/delete-friend-request/${receiverId}`, {
      onSuccess: async (response) => {
        toast.success(response?.message || "Request cancelled");

        setOutgoingRequests((prev) =>
          prev.filter((user) => user.id !== receiverId),
        );

        queryClient.setQueryData(["request"], (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            outGoingRequets: oldData.outGoingRequets?.filter(
              (user) => user.id !== receiverId,
            ),
          };
        });

        setPending(null);
      },

      onError: (error) => {
        toast.error(error?.message || "Failed to cancel request");
        setPending(null);
      },
    });
  };

  return (
    <section className="w-full min-h-[97vh] overflow-auto">
      <div className="flex flex-col w-full">
        <div className="card-body gap-2">
          <h2 className="card-title text-xl">Sent Friend Requests</h2>

          <p>
            Meet new learners ready to exchange skills and practice together.
          </p>

          <div className="bg-base-100 p-4 rounded-lg mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full h-fit min-h-30">
            {outgoingLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <FriendCardSkeleton key={index} />
              ))
            ) : outgoingRequests.length === 0 ? (
              <div className="col-span-full flex flex-col w-full h-full items-center gap-3 py-8">
                <h3 className="text-xl">Expand Your Network</h3>

                <p className="para text-center">
                  Meet new learners ready to exchange skills and practice
                  together.
                </p>
              </div>
            ) : (
              outgoingRequests.map((friend) => {
                const isCancelling = pending === friend.id;

                return (
                  <div
                    key={friend.id}
                    className="card bg-base-300 w-full max-w-lg mx-auto shadow-lg hover:-translate-y-2 transition-transform duration-300"
                  >
                    <div className="card-body gap-4">
                      <div className="flex justify-between gap-3">
                        <div className="flex gap-3">
                          <div
                            className={`avatar ${
                              navigator.onLine
                                ? "avatar-online"
                                : "avatar-offline"
                            }`}
                          >
                            <div className="rounded-full">
                              <img
                                src={friend.image}
                                alt={`${friend.fullName}'s profile`}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <h3 className="text-lg">{friend.fullName}</h3>

                            <span className="flex gap-2 para">
                              <MapPin size={18} />
                              {friend.location}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn h-8 px-3 rounded-xl bg-red-200 text-base-content"
                          onClick={() => cancelRequest(friend.id)}
                          disabled={isCancelling}
                        >
                          {isCancelling ? (
                            <>
                              <span className="loading loading-ball loading-xs" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <X size={18} />
                              Cancel
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-base-content text-sm">{friend.bio}</p>

                      <div className="flex items-center gap-3 border-t border-t-gray-400">
                        <span className="flex gap-2 items-center text-info mt-3">
                          <Flag size={18} />
                          {friend.language}
                        </span>

                        <button
                          type="button"
                          className="btn h-7 rounded-2xl mt-3 text-sm text-info"
                        >
                          Skill: {friend.skill}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RequestsPage;
