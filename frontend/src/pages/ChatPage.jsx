
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Video, Menu, X, Smile, Send } from "lucide-react";
import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  Thread,
  Window,
  useCreateChatClient,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import EmojiPicker from "emoji-picker-react";
import "stream-chat-react/dist/css/index.css";

import useAuthUser from "../hooks/useAuthUser";
import useGetChatToken from "../hooks/useGetChatToken";
import Loading from "../components/Loading";

/* =========================
   CUSTOM HEADER
========================= */

const CustomHeader = ({ onToggleSidebar }) => {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
  const navigate = useNavigate();

  const members = Object.values(channel?.state?.members || {});

  const otherMember =
    members.find((member) => member.user?.id !== client.userID) ||
    members[0];

  const title =
    channel?.data?.name ||
    otherMember?.user?.name ||
    "Chat";

  const avatar =
    channel?.data?.image ||
    otherMember?.user?.image;

  const handleVideoCall = async () => {
    if (!channel?.id) return;

    try {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      await channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      navigate(`/call/${channel.id}`);
    } catch (error) {
      console.error("Failed to start video call:", error);
    }
  };

  return (
    <div className="chat-header">
      <div className="flex items-center gap-3">
        {/* Mobile sidebar button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="chat-icon-button md:hidden"
          aria-label="Toggle channels sidebar"
        >
          <Menu className="size-5" />
        </button>

        {/* Avatar */}
        <div className="avatar online">
          <div className="w-9 h-9 rounded-full">
            <img
              src={
                avatar ||
                `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(
                  title
                )}`
              }
              alt={title}
            />
          </div>
        </div>

        {/* User name */}
        <div>
          <h5 className="leading-tight">{title}</h5>
          <span className="text-[11px] text-success font-medium">
            Online
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="chat-icon-button"
          title="Start Video Call"
          onClick={handleVideoCall}
        >
          <Video className="size-5 text-primary" />
        </button>
      </div>
    </div>
  );
};

/* =========================
   CUSTOM MESSAGE COMPOSER
========================= */

const CustomComposer = () => {
  const { channel } = useChannelStateContext();

  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const sendMessage = async () => {
    const message = text.trim();

    if (!message || !channel || sending) return;

    try {
      setSending(true);

      await channel.sendMessage({
        text: message,
      });

      setText("");
      setShowEmoji(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event) => {
    // Enter sends the message
    // Shift + Enter creates a new line
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative">
      {/* Emoji picker */}
      {showEmoji && (
        <div className="absolute bottom-16 left-3 z-50 shadow-2xl rounded-2xl overflow-hidden border border-base-300">
          <EmojiPicker
            theme="auto"
            onEmojiClick={handleEmojiClick}
          />
        </div>
      )}

      <div className="flex items-end gap-2 bg-base-100 p-2 border-t border-base-300">
        {/* Emoji button */}
        <button
          type="button"
          onClick={() => setShowEmoji((prev) => !prev)}
          className="chat-icon-button shrink-0"
          title="Add Emoji"
        >
          <Smile className="size-5 text-base-content/70" />
        </button>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          disabled={sending}
          className="flex-1 min-w-0 resize-none rounded-lg bg-base-200 px-3 py-2 outline-none border border-base-300 focus:border-primary"
        />

        {/* Send button */}
        <button
          type="button"
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          className="chat-icon-button shrink-0 disabled:opacity-40"
          title="Send message"
        >
          <Send className="size-5 text-primary" />
        </button>
      </div>
    </div>
  );
};

/* =========================
   CHAT PAGE
========================= */

export default function ChatPage() {
  const { userId } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading: userLoading } = useAuthUser();

  const currentUser = data?.user;

  const {
    data: tokenData,
    isLoading: tokenLoading,
  } = useGetChatToken(currentUser);

  const token = tokenData?.token;

  const client = useCreateChatClient({
    apiKey: import.meta.env.VITE_STREAM_API_KEY,

    tokenOrProvider: token,

    userData: currentUser
      ? {
          id: String(currentUser.id),
          name: currentUser.fullName,
          image: currentUser.image,
        }
      : null,
  });

  if (userLoading || tokenLoading || !client) {
    return <Loading />;
  }

  /* =========================
     CHANNEL FILTERS
  ========================= */

  const filters = {
    type: "messaging",

    members: {
      $in: [String(currentUser.id)],
    },

    ...(searchQuery.trim() && {
      name: {
        $autocomplete: searchQuery,
      },
    }),
  };

  const sort = {
    last_message_at: -1,
  };

  return (
    <div className="chat-page">
      <div className="chat-layout">
        <Chat client={client}>
          {/* =========================
              MOBILE OVERLAY
          ========================= */}

          {isSidebarOpen && (
            <div
              className="chat-mobile-overlay"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* =========================
              SIDEBAR
          ========================= */}

          <div
            className={`chat-sidebar ${
              isSidebarOpen ? "chat-sidebar-open" : ""
            }`}
          >
            <div className="chat-sidebar-header flexBetween">
              <h4>Messages</h4>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="chat-icon-button md:hidden"
                aria-label="Close sidebar"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Search */}
            <div className="chat-search-wrapper">
              <div className="chat-search">
                <Search className="size-4 text-base-content/40 shrink-0" />

                <input
                  type="text"
                  placeholder="Search channels..."
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                />
              </div>
            </div>

            {/* Channels */}
            <div className="chat-channel-list">
              <ChannelList
                filters={filters}
                sort={sort}
                sendChannelsToList
                onSelect={() => setIsSidebarOpen(false)}
              />
            </div>
          </div>

          {/* =========================
              MAIN CHAT
          ========================= */}

          <div className="chat-main">
            <Channel>
              <Window>
                <CustomHeader
                  onToggleSidebar={() =>
                    setIsSidebarOpen((prev) => !prev)
                  }
                />

                <MessageList />

                {/* Our own textarea composer */}
                <CustomComposer />
              </Window>

              <Thread />
            </Channel>
          </div>
        </Chat>
      </div>
    </div>
  );
}

