"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import { useChatContext } from "../../../context/ChatProvider";
import { CurrentUserReturnType } from "../../../lib/session";
import useAxiosAuth from "../../../lib/hooks/useAxiosAuth";
import socket from "../../../lib/socket";

type chatHistoryProps = {
  user?: CurrentUserReturnType;
};

const ChatHistory: React.FC<chatHistoryProps> = ({ user }) => {
  const { currentChat, messages, setMessages } = useChatContext();
  const axiosAuth = useAxiosAuth(user);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      console.log({ currentChat });
      if (currentChat?._id) {
        const { data } = await axiosAuth.get(
          `/chat/conversation/message/${currentChat?._id}`
        );

        console.log("fetchMessages", { data });

        setMessages?.([...data]);
      }
    };

    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?._id]);

  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onReceiveMessage = (data: {
      id: string;
      conversation_id: string;
      sender_id: string;
      message: string;
    }) => {
      console.log("Receiving message: ", data);
      console.log({
        currentChat: currentChat,
        data: data.conversation_id,
      });
      if (currentChat?._id === data.conversation_id) {
        console.log("Adding message to state");
        setMessages?.((prev) => [
          ...prev,
          {
            _id: data.id,
            conversation_id: data.conversation_id,
            message: data.message,
            sender_id: data.sender_id,
          },
        ]);
      } else {
        //handle message notification
      }
    };

    socket.on("receiveMessage", onReceiveMessage);

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?._id]);

  return (
    <>
      <div
        id="messages"
        className="flex h-full flex-col space-y-4 overflow-y-auto p-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400"
      >
        <div className="flex flex-auto"></div>
        {messages?.map((message) => {
          return (
            <ChatMessage
              key={message._id}
              message={message.message}
              isSentByUser={user?.id == message.sender_id}
            />
          );
        })}
        <div ref={lastMessageRef}></div>
      </div>
    </>
  );
};

export default ChatHistory;
