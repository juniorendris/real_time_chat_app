import { useState, useEffect } from "react";
import useGetIncomming from "../hooks/useGetIncomming";
import useGetAcceptedFriendRequest from "../hooks/useGetAcceptedFriendRequest";
import useAcceptRequest from "../hooks/useAcceptRequest";
import { useQueryClient } from "@tanstack/react-query";
import FriendCardSkeleton from "../components/FriendCardSkeleton";
import { MapPin, Flag, User } from "lucide-react";
import toast from "react-hot-toast";

function NotificationPage() {
  const queryClient = useQueryClient();
  const [friendRegests, setFriendRegests] = useState([]);
  const [pending, setPending] = useState(null);
  // get driend requests
  const { data: requesetList, isLoading } = useGetIncomming();
  useEffect(() => {
    setFriendRegests(() => requesetList?.friendRegests ?? []);
  }, [requesetList]);
  //accept friendrequest
  const { mutate: accept } = useAcceptRequest();
  //accepted friend requests
  const { fetchingAcceptedFriendRequest, friendRecently } =
    useGetAcceptedFriendRequest();
  const newFriends = friendRecently?.acceptedFriends || [];
  //accept request handler
  const acceptRequestHandler = (senderId) => {
    setPending(senderId);
    accept(`/user/friend-request/${senderId}/accepted`, {
      onSuccess: async (response) => {
        toast.success(response.message || "Request cancelled");
        setFriendRegests((prev) => prev.filter((id) => id !== senderId));
        await queryClient.invalidateQueries({ queryKey: ["/friend-request"] });
        setPending(null);
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to cancel request");
        setPending(null);
      },
    });
  };
  return (
    <div>
      <section className="w-full">
        <div className="flex flex-col w-full ">
          {/* friends */}
          <div className="card-body gap-2">
            <h2 className="card-title text-xl">Friend Request</h2>

            <p>Connect and practice skills with your learning partners</p>

            <div
              className={`bg-base-100 p-4 w-full rounded-lg mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ${
                friendRegests.length === 0 ? "min-h-30" : " h-fit"
              }`}
            >
              {" "}
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <FriendCardSkeleton key={index} />
                ))
              ) : friendRegests.length === 0 ? (
                <div className="col-span-full flex flex-col h-full  items-center gap-2">
                  <h3 className="text-xl">No Friends yet</h3>
                  <p className="para">ask request and get partners</p>
                </div>
              ) : (
                friendRegests.map((friend) => (
                  <div
                    className="card bg-base-300 w-full max-w-lg mx-auto shadow-lg hover:-translate-y-2 transition-transform duration-300"
                    key={friend.id}
                  >
                    <div className="card-body gap-4">
                      <div className="flex justify-between">
                        <div className="flex gap-3">
                          <div
                            className={`avatar ${navigator.onLine ? "avatar-online" : "avatar-offline"}`}
                          >
                            <div className=" rounded-full">
                              <img
                                src={friend.image}
                                alt="profile"
                                className="w-12 h-12  rounded-full object-cover"
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
                          className="btn  h-5 p-3 rounded-xl"
                          onClick={() => {
                            acceptRequestHandler(friend.id);
                          }}
                          disabled={friend.id === pending}
                        >
                          <User size={18} />
                          {pending === friend.id ? (
                            <span className="loading loading-ball loading-xs"></span>
                          ) : (
                            ""
                          )}
                          Accept
                        </button>
                      </div>
                      <p className="text-base-content text-sm">{friend.bio}</p>
                      <div className="flex items-center gap-3 border-t  border-t-gray-400">
                        <span className="flex gap-2 items-center  text-info mt-3">
                          <Flag size={18} />
                          {friend.language}
                        </span>
                        <button className="btn  h-7 rounded-2xl mt-3 text-sm text-info">{`skill ${friend.skill}`}</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      {/* user that accept my request*/}
      <section className="w-full">
        <div className="flex flex-col w-full ">
          {/* friends */}
          <div className="card-body gap-2">
            <h2 className="card-title text-xl">
              Friend who Accept your Request
            </h2>

            <p>chat and practice skills with your learning partners</p>

            <div
              className={`bg-base-100 p-4 w-full rounded-lg mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ${
                newFriends.length === 0 ? "min-h-30" : " h-fit"
              }`}
            >
              {" "}
              {fetchingAcceptedFriendRequest ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <FriendCardSkeleton key={index} />
                ))
              ) : newFriends.length === 0 ? (
                <div className="col-span-full flex flex-col h-full  items-center gap-2">
                  <h3 className="text-xl">No Friends yet</h3>
                  <p className="para">ask request and get partners</p>
                </div>
              ) : (
                newFriends.map((friend) => (
                  <div
                    className="card bg-base-300 w-full max-w-lg mx-auto shadow-lg hover:-translate-y-2 transition-transform duration-300"
                    key={friend.id}
                  >
                    <div className="card-body gap-4">
                      <div className="flex justify-between">
                        <div className="flex gap-3">
                          <div
                            className={`avatar ${navigator.onLine ? "avatar-online" : "avatar-offline"}`}
                          >
                            <div className=" rounded-full">
                              <img
                                src={friend.image}
                                alt="profile"
                                className="w-12 h-12  rounded-full object-cover"
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
                          className="btn  h-5 p-3 rounded-xl"
                          onClick={() => {
                            acceptRequestHandler(friend.id);
                          }}
                          disabled={friend.id === pending}
                        >
                          <User size={18} />
                          {pending === friend.id ? (
                            <span className="loading loading-ball loading-xs"></span>
                          ) : (
                            ""
                          )}
                          new message
                        </button>
                      </div>
                      <p className="text-base-content text-sm">{friend.bio}</p>
                      <div className="flex items-center gap-3 border-t  border-t-gray-400">
                        <span className="flex gap-2 items-center  text-info mt-3">
                          <Flag size={18} />
                          {friend.language}
                        </span>
                        <button className="btn  h-7 rounded-2xl mt-3 text-sm text-info">{`skill ${friend.skill}`}</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NotificationPage;
