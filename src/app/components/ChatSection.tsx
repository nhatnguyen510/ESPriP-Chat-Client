"use client";

import * as React from "react";
import ChatHeader from "./ChatHeader";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import { useChatContext } from "@/../context/ChatProvider";
import { CurrentUserReturnType } from "@/../lib/session";
import { useEffect } from "react";
import { ConversationProps, MessageProps } from "@/../types";
import { decryptMessage } from "@/../lib/encryption";
import { useSessionKeysStore } from "@/../lib/zustand/store";
import socket from "@/../lib/socket";
import { ListenEvent } from "@/../lib/enum";

type ChatSectionProps = {};

const ChatSection: React.FC<ChatSectionProps> = () => {
  const {
    selectedUser,
    currentChat,
    setMessages,
    setCurrentChat,
    setConversations,
  } = useChatContext();

  const { sessionKeys } = useSessionKeysStore();

  // Receive message
  useEffect(() => {
    const onReceiveMessage = (data: {
      message: MessageProps;
      updatedConversation: ConversationProps;
    }) => {
      console.log("Receiving message: ", data);
      const message = data.message;
      const updatedConversation = data.updatedConversation;

      // decrypt message
      const decryptedMessage = {
        ...message,
        message: decryptMessage(
          JSON.parse(message.message),
          Buffer.from(sessionKeys[updatedConversation.id], "hex")
        ),
      };

      const decryptedUpdatedConversation: ConversationProps = {
        ...updatedConversation,
        last_message: decryptedMessage,
      };

      if (currentChat?.id === updatedConversation.id) {
        console.log("Adding message to state");
        setMessages?.((prev) => [...prev, decryptedMessage]);
        setCurrentChat?.(decryptedUpdatedConversation);
      }

      // update conversation last message
      setConversations?.((prev) => {
        const index = prev.findIndex(
          (conversation) => conversation.id == decryptedUpdatedConversation.id
        );
        const newConversations = [...prev];
        newConversations[index] = decryptedUpdatedConversation;

        return newConversations;
      });
    };

    socket.on(ListenEvent.ReceiveMessage, onReceiveMessage);

    return () => {
      socket.off(ListenEvent.ReceiveMessage, onReceiveMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?.id, sessionKeys]);

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
