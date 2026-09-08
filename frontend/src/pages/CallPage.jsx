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
  const { callId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: userLoading } = useAuthUser();
  const currentUser = data?.user;

  const {
    data: tokenData,
    isLoading: tokenLoading,
  } = useGetChatToken(currentUser);

  const token = tokenData?.token;

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    if (!currentUser || !token || !callId) {
      return;
    }

    let videoClient;
    let videoCall;
    let cancelled = false;

    const startCall = async () => {
      try {
        videoClient = new StreamVideoClient({
          apiKey: import.meta.env.VITE_STREAM_API_KEY,
          user: {
            id: String(currentUser.id),
            name: currentUser.fullName,
            image: currentUser.image,
          },
          token,
        });

        videoCall = videoClient.call("default", callId);

        await videoCall.join({
          create: true,
        });

        if (cancelled) {
          await videoCall.leave();
          await videoClient.disconnectUser();
          return;
        }

        setClient(videoClient);
        setCall(videoCall);

        console.log("Joined call:", callId);
      } catch (error) {
        console.error("Failed to join video call:", error);
      }
    };

    startCall();

    return () => {
      cancelled = true;

      const cleanup = async () => {
        try {
          if (videoCall) {
            await videoCall.leave();
          }

          if (videoClient) {
            await videoClient.disconnectUser();
          }
        } catch (error) {
          console.error("Call cleanup error:", error);
        }
      };

      cleanup();

      setCall(null);
      setClient(null);
    };
  }, [currentUser, token, callId]);

  if (userLoading || tokenLoading || !client || !call) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-full">
      <StreamVideo client={client}>
        <StreamTheme>
          <StreamCall call={call}>
            <div className="flex h-full flex-col">
              {/* Participants */}
              <div className="min-h-0 flex-1">
                <SpeakerLayout />
              </div>

              {/* Controls */}
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