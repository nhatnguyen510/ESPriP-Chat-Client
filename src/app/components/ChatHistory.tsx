"use client";

import React, { use, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import { MessageProps } from "@/../types/types";
import { CurrentUserReturnType } from "@/../lib/session";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import socket from "@/../lib/socket";
import { useChatContext } from "@/../context/ChatProvider";
import LoadingSpinner from "./LoadingSpinner";
import { BsArrowDownCircle } from "react-icons/bs";
import { useMessages } from "@/../lib/hooks/useMessages";

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
  const loadingRef = useRef<HTMLSpanElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [isOldMessageVisible, setIsOldMessageVisible] =
    useState<boolean>(false);

  const [isScrollDownBtnVisible, setIsScrollDownBtnVisible] =
    useState<boolean>(false);

  const { lastMessage, isLastMessageSeen, noMoreMessages } = useMessages(
    messages,
    currentChat,
    user?.id
  );

  // Function to fetch more messages when scrolling to the top
  const fetchMoreMessages = useCallback(async () => {
    if (noMoreMessages) {
      return;
    }

    if (currentChat?.id) {
      setLoading(true);

      const { data } = await axiosAuth.get(
        `/conversation/${currentChat?.id}/message`,
        {
          params: {
            page: Math.ceil((messages?.length || 0) / 20) + 1,
            limit: 20,
          },
        }
      );

      console.log("fetchMoreMessages", { data });

      setMessages?.((prev) => [...data, ...prev]);

      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop += 50; // Adjust the scroll position as needed
      }

      // wait for 1 second to simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?.id, messages?.length, noMoreMessages]);

  // Fetch messages for current conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat?.id) {
        const { data } = await axiosAuth.get(
          `/conversation/${currentChat?.id}/message`,
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
  }, [currentChat?.id]);

  // Scroll to bottom of messages
  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser?.id, currentChat?.lastMessage?.id]);

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
          `/conversation/${currentChat?.id}/message/seen`
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
          (conversation) => conversation.id == currentChat?.id
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

      // socket.emit("markMessagesAsSeen", {
      //   conversation_id: currentChat?.id,
      //   sender_id: user?.id,
      //   receiver_id: selectedUser?.id,
      //   seen: true,
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?.id, messages?.length, selectedUser?.id, user?.id]);

  // Receive message
  useEffect(() => {
    const onReceiveMessage = (
      data: MessageProps & {
        lastMessageAt: string;
        lastMessage: MessageProps;
      }
    ) => {
      console.log("Receiving message: ", data);
      if (currentChat?.id === data.conversation_id) {
        console.log("Adding message to state");
        setMessages?.((prev) => [
          ...(prev as any),
          {
            _id: data.id,
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
          (conversation) => conversation.id == data.conversation_id
        );
        const newConversations = [...prev];
        newConversations[index].lastMessageAt = data.lastMessageAt;
        newConversations[index].lastMessage = data.lastMessage;
        return newConversations;
      });

      // update current chat last message
      setCurrentChat?.((prev) => {
        if (prev?.id === data.conversation_id) {
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
  }, [currentChat?.id]);

  // Observe the old message to fetch more messages when scrolling to the top
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && messages?.length) {
          fetchMoreMessages();
          console.log("Is intersecting");
        }
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: "0px",
        threshold: 1, // Fire when 100% of the target is visible
      }
    );

    const currentRef = loadingRef.current; // Copy the ref value to a variable

    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup the observer when the component unmounts
    return () => observer.disconnect();
  }, [fetchMoreMessages, messages?.length]);

  return (
    <>
      <div
        id="messages"
        ref={chatContainerRef}
        onScroll={() => {
          if (
            chatContainerRef.current &&
            messages!.length > 20 &&
            Math.floor(
              (chatContainerRef.current.scrollTop /
                (chatContainerRef.current.scrollHeight -
                  chatContainerRef.current.clientHeight)) *
                100
            ) < 90
          ) {
            setIsScrollDownBtnVisible(true);
          } else {
            setIsScrollDownBtnVisible(false);
          }
        }}
        className="flex h-full flex-col space-y-4 overflow-auto p-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400"
      >
        {!noMoreMessages && (
          <span ref={loadingRef} className="flex justify-center">
            <LoadingSpinner />
          </span>
        )}

        {messages?.map((message) => {
          return (
            <ChatMessage
              key={message.id}
              message={message.message}
              isSentByUser={user?.id == message.sender_id}
              isLastMessage={lastMessage?.id == message.id}
              isSeen={isLastMessageSeen}
            />
          );
        })}
        {isScrollDownBtnVisible && (
          <span
            className="absolute bottom-24 left-0 right-0 flex cursor-pointer justify-center"
            onClick={() => {
              lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <BsArrowDownCircle className="h-6 w-6 animate-bounce text-gray-400" />
          </span>
        )}

        <div ref={lastMessageRef}></div>
      </div>
    </>
  );
};

export default ChatHistory;
