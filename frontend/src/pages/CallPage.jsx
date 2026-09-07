import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

import useAuthUser from "../hooks/useAuthUser";
import useGetChatToken from "../hooks/useGetChatToken";
import Loading from "../components/Loading";

function CallPage() {
  // Get callId from:
  // /call/:callId
  const { callId } = useParams();

  const navigate = useNavigate();

  // Get logged-in user
  const { data, isLoading: userLoading } = useAuthUser();

  const currentUser = data?.user;

  // Get Stream Video token
  const {
    data: tokenData,
    isLoading: tokenLoading,
  } = useGetChatToken(currentUser);

  const token = tokenData?.token;

  // Stream Video client
  const [client, setClient] = useState(null);

  // Current video call
  const [call, setCall] = useState(null);

  useEffect(() => {
    // Wait until we have user, token and callId
    if (!currentUser || !token || !callId) {
      return;
    }

    // Create Stream Video client
    const videoClient = new StreamVideoClient({
      apiKey: import.meta.env.VITE_STREAM_API_KEY,

      user: {
        id: String(currentUser.id),
        name: currentUser.fullName,
        image: currentUser.image,
      },

      token,
    });

    // Create/get the video call
    const videoCall = videoClient.call(
      "default",
      callId
    );

    // Join the call
    const joinCall = async () => {
      try {
        await videoCall.join({
          create: true,
        });

        setClient(videoClient);
        setCall(videoCall);
      } catch (error) {
        console.error(
          "Failed to join video call:",
          error
        );
      }
    };

    joinCall();

    // Leave call when page closes
    return () => {
      videoCall.leave().catch((error) => {
        console.error("Failed to leave call:", error);
      });

      videoClient.disconnectUser().catch((error) => {
        console.error(
          "Failed to disconnect user:",
          error
        );
      });
    };
  }, [currentUser, token, callId]);

  // Show loading while preparing call
  if (
    userLoading ||
    tokenLoading ||
    !client ||
    !call
  ) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-ful">
      <StreamVideo client={client}>
        <StreamTheme>
          <StreamCall call={call}>

            <div className="flex h-full flex-col">

              {/* Video participants */}
              <div className="min-h-0 flex-1">
                <SpeakerLayout />
              </div>

              {/* Camera / Mic / Leave buttons */}
              <div className="shrink-0">
                <CallControls
                  onLeave={() => {
                    navigate("/chat");
                  }}
                />
              </div>

            </div>

          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    </div>
  );
}

export default CallPage;