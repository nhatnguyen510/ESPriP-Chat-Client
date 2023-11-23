"use client";

import * as React from "react";
import ChatHeader from "./ChatHeader";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import { useChatContext } from "@/../context/ChatProvider";
import { CurrentUserReturnType } from "@/../lib/session";

type ChatSectionProps = {};

const ChatSection: React.FC<ChatSectionProps> = () => {
  const { selectedUser } = useChatContext();

  return selectedUser ? (
    <>
      <ChatHeader />
      <ChatHistory />
      <ChatInput />
    </>
  ) : (
    <>
      <div className="flex h-full items-center justify-center">
        <h1 className="text-2xl text-gray-400">
          Select a friend to start chatting
        </h1>
      </div>
    </>
  );
};

export default ChatSection;
