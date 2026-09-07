import { useState } from "react";
import useGetFriends from "../hooks/useGetFriends";
import useGetRecommendedFreinds from "../hooks/useGetRecommendedFreinds";
import useSendrequest from "../hooks/useSendrequest";
import useDeleteRequest from "../hooks/useDeleteRequest";
import FriendCardSkeleton from "../components/FriendCardSkeleton";
import { MapPin, MessageSquareShare, Flag, User } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [pending, setPending] = useState(null);
  // friendsLists
  const { data, isLoading: loadingFriends } = useGetFriends();
  const frineds = data?.friends || [];
  const { isLoading: loadingRecomm, data: recommendedFrindsList } =
    useGetRecommendedFreinds();
  const getFriend = recommendedFrindsList?.getFriend || [];

  //Send request
  const { mutate: sendRequest } = useSendrequest();
  const { mutate: cancelRequest } = useDeleteRequest();

  //id state handler
  const toggleRequestHandler = (receiverId) => {
    const isSent = requests.includes(receiverId);
    setPending(receiverId);
    if (isSent) {
      const url = `/user/delete-friend-request/${receiverId}`;
      cancelRequest(url, {
        onSuccess: (response) => {
          toast.success(response.message || "Request cancelled");
          setRequests((prev) => prev.filter((id) => id !== receiverId));
          setPending(null);
        },

        onError: (error) => {
          toast.error(error?.message || "Failed to cancel request");
          setPending(null);
        },
      });

      return;
    }

    sendRequest(`/user/friend-request/${receiverId}`, {
      onSuccess: (response) => {
        toast.success(response.message || "Request sent");
        setRequests((prev) => [...prev, receiverId]);
        setPending(null);
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to send request");
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
            <h2 className="card-title text-xl">Learning Partners</h2>

            <p>Connect and practice skills with your learning partners</p>

            <div
              className={`bg-base-100 p-4 w-full rounded-lg mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ${
                frineds.length === 0 ? "min-h-30" : " h-fit"
              }`}
            >
              {" "}
              {loadingFriends ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <FriendCardSkeleton key={index} />
                ))
              ) : frineds.length === 0 ? (
                <div className="col-span-full flex flex-col h-full  items-center gap-2">
                  <h3 className="text-xl">No Friends yet</h3>
                  <p className="para">ask request and get partners</p>
                </div>
              ) : (
                frineds.map((friend, index) => (
                  <div
                    className="card bg-base-300 w-full max-w-lg mx-auto shadow-lg hover:-translate-y-1 transition-transform duration-300 mt-3"
                    key={index}
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
                          className="btn h-5 p-3 btn-info rounded-xl"
                          onClick={() => navigate(`/chat/${friend.id}`)}
                        >
                          <MessageSquareShare size={18} />
                          Messages
                        </button>
                      </div>
                      <div className="flex items-center gap-3 border-t  border-t-gray-400">
                        <span className="flex gap-2 items-center  text-info mt-3">
                          <Flag size={18} />
                          {friend.language}
                        </span>
                        <button className="btn h-7 rounded-2xl mt-3 text-sm text-info">{`skill ${friend.skill}`}</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      {/* recommneded usr */}
      <section className="w-full">
        <div className="flex flex-col w-full ">
          {/* recommneded */}
          <div className="card-body gap-2">
            <h2 className="card-title text-xl">Expnad your Networks</h2>

            <p>
              {" "}
              Meet new lerners ready to exchange skills and practice together
            </p>

            <div
              className={`bg-base-100 p-4 rounded-lg mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full ${
                getFriend.length === 0 ? "h-30" : "h-fit"
              }`}
            >
              {loadingRecomm ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <FriendCardSkeleton key={index} />
                ))
              ) : getFriend.length === 0 ? (
                <div className="col-span-full flex flex-col w-full h-full  items-center gap-3">
                  <h3 className="text-xl">Expnad your Networks</h3>
                  <p className="para">
                    Meet new lerners ready to exchange skills and practice
                    together
                  </p>
                </div>
              ) : (
                getFriend.map((friend) => (
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
                            toggleRequestHandler(friend.id);
                          }}
                          disabled={friend.id === pending}
                        >
                          <User size={18} />
                          {pending === friend.id ? (
                            <span className="loading loading-ball loading-xs"></span>
                          ) : (
                            ""
                          )}

                          {requests.includes(friend.id)
                            ? "Cancele Request"
                            : "send Request"}
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

export default HomePage;
