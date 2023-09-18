"use client";

import React, { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import { MessageProps } from "@/../types/types";
import { CurrentUserReturnType } from "@/../lib/session";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import socket from "@/../lib/socket";
import { useChatContext } from "@/../context/ChatProvider";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce } from "lodash";
import LoadingSpinner from "./LoadingSpinner";

type chatHistoryProps = {
  user?: CurrentUserReturnType;
};

const ChatHistory: React.FC<chatHistoryProps> = ({ user }) => {
  const {
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    conversations,
    setConversations,
    selectedUser,
  } = useChatContext();
  const axiosAuth = useAxiosAuth(user);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const oldMessageRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [isOldMessageVisible, setIsOldMessageVisible] =
    useState<boolean>(false);

  const lastMessage = messages?.[messages?.length - 1];

  const isLastMessageSeen = messages?.[messages?.length - 1]?.seen;

  const isOwnLastMessage =
    messages?.[messages?.length - 1]?.sender_id === user?.id;

  // Function to fetch more messages when scrolling to the top
  const fetchMoreMessages = async () => {
    if (messages!.length % 20 !== 0) {
      return;
    }

    const { data } = await axiosAuth.get(
      `/chat/conversation/message/${currentChat?._id}`,
      {
        params: {
          page: Math.ceil((messages?.length || 0) / 20) + 1,
          limit: 20,
        },
      }
    );

    console.log("fetchMoreMessages", { data });

    setMessages?.((prev) => [...data, ...prev]);
  };

  const handleScroll = async (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const element = e.target as HTMLDivElement;

    if (element.scrollTop === 0 && !loading) {
      setLoading(true);

      // wait for 2 seconds before fetching more messages
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await fetchMoreMessages();

      setLoading(false);
    }
  };

  // Fetch messages for current conversation
  useEffect(() => {
    const fetchMessages = async () => {
      console.log({ currentChat });
      if (currentChat?._id) {
        const { data } = await axiosAuth.get(
          `/chat/conversation/message/${currentChat?._id}`,
          {
            params: {
              page: 1,
              limit: 20,
            },
          }
        );

        console.log("fetchMessages", { data });

        setMessages?.([...data]);
      }
    };

    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?._id]);

  // Scroll to bottom of messages
  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser?._id]);

  // Mark messages as seen
  useEffect(() => {
    if (
      currentChat &&
      messages &&
      !currentChat.lastMessage?.seen &&
      currentChat.lastMessage?.sender_id !== user?.id
    ) {
      const markMessagesAsSeen = async () => {
        const { data } = await axiosAuth.post(
          `/chat/conversation/message/seen`,
          {
            conversation_id: currentChat?._id,
          }
        );

        console.log("markMessagesAsSeen", { data });
      };

      markMessagesAsSeen();

      setCurrentChat?.((prev) => {
        return {
          ...(prev as any),
          lastMessage: {
            ...prev?.lastMessage,
            seen: true,
          },
        };
      });

      setConversations?.((prev) => {
        const index = prev.findIndex(
          (conversation) => conversation._id == currentChat?._id
        );
        const newConversations = [...prev];
        if (newConversations[index].lastMessage) {
          newConversations[index].lastMessage!.seen = true;
        }
        return newConversations;
      });

      setMessages?.((prev) =>
        prev?.map((message) => {
          if (message.sender_id !== user?.id && message.seen === false) {
            return { ...message, seen: true };
          }

          return message;
        })
      );

      socket.emit("markMessagesAsSeen", {
        conversation_id: currentChat?._id,
        sender_id: user?.id,
        receiver_id: selectedUser?._id,
        seen: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?._id, messages?.length, selectedUser?._id, user?.id]);

  // Receive message
  useEffect(() => {
    const onReceiveMessage = (
      data: MessageProps & {
        lastMessageAt: string;
        lastMessage: MessageProps;
      }
    ) => {
      console.log("Receiving message: ", data);
      if (currentChat?._id === data.conversation_id) {
        console.log("Adding message to state");
        setMessages?.((prev) => [
          ...prev,
          {
            _id: data._id,
            conversation_id: data.conversation_id,
            message: data.message,
            sender_id: data.sender_id,
            seen: data.seen,
          },
        ]);
      }

      // update conversation last message
      setConversations?.((prev) => {
        const index = prev.findIndex(
          (conversation) => conversation._id == data.conversation_id
        );
        const newConversations = [...prev];
        newConversations[index].lastMessageAt = data.lastMessageAt;
        newConversations[index].lastMessage = data.lastMessage;
        return newConversations;
      });

      // update current chat last message
      setCurrentChat?.((prev) => {
        if (prev?._id === data.conversation_id) {
          return {
            ...(prev as any),
            lastMessageAt: data.lastMessageAt,
            lastMessage: data.lastMessage,
          };
        }

        return prev;
      });
    };

    socket.on("receiveMessage", onReceiveMessage);

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?._id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsOldMessageVisible(entry.isIntersecting);
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: "0px",
        threshold: 1.0, // Fire when 100% of the target is visible
      }
    );

    const currentRef = oldMessageRef.current; // Copy the ref value to a variable

    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup the observer when the component unmounts
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (isOldMessageVisible && !loading) {
      setLoading(true);

      fetchMoreMessages();

      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOldMessageVisible, loading]);

  console.log({ isOldMessageVisible });

  return (
    <>
      <div
        id="messages"
        className="flex h-full flex-col space-y-4 overflow-auto p-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400"
        // onScroll={handleScroll}
      >
        {loading && (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        <div ref={oldMessageRef}></div>

        {messages?.map((message) => {
          return (
            <ChatMessage
              key={message._id}
              message={message.message}
              isSentByUser={user?.id == message.sender_id}
              isLastMessage={lastMessage?._id == message._id}
              isSeen={isLastMessageSeen}
            />
          );
        })}
        <div ref={lastMessageRef}></div>
      </div>
    </>
  );
};

export default ChatHistory;
