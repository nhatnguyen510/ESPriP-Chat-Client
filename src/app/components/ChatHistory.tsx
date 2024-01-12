"use client";

import React, { use, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import { ConversationProps, MessageProps } from "@/../types";
import { CurrentUserReturnType } from "@/../lib/session";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import socket from "@/../lib/socket";
import { useChatContext } from "@/../context/ChatProvider";
import LoadingSpinner from "./LoadingSpinner";
import { BsArrowDownCircle } from "react-icons/bs";
import { useMessages } from "@/../lib/hooks/useMessages";
import { EmitEvent, ListenEvent } from "@/../lib/enum";
import { useSession } from "next-auth/react";
import { useSessionKeysStore } from "@/../lib/zustand/store";
import { decryptMessage } from "@/../lib/encryption";

type chatHistoryProps = {};

const ChatHistory: React.FC<chatHistoryProps> = () => {
  const {
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    conversations,
    setConversations,
    selectedUser,
  } = useChatContext();
  const { sessionKeys } = useSessionKeysStore();
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();
  const user = session?.user;
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<HTMLSpanElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false);
  const [isOldMessageVisible, setIsOldMessageVisible] =
    useState<boolean>(false);

  const [isScrollDownBtnVisible, setIsScrollDownBtnVisible] =
    useState<boolean>(false);

  const [noMoreMessages, setNoMoreMessages] = useState<boolean>(false);

  const { lastMessage, isLastMessageSeen } = useMessages(
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
      const { data } = await axiosAuth.get<MessageProps[]>(
        `/conversation/${currentChat?.id}/message`,
        {
          params: {
            page: Math.ceil((messages?.length || 0) / 20) + 1,
            limit: 20,
          },
        }
      );

      if (!data.length) {
        setNoMoreMessages(true);
        return;
      }

      // decrypt messages

      const decryptedMessages = data?.map((message) => {
        return {
          ...message,
          message: decryptMessage(
            JSON.parse(message.message),
            Buffer.from(sessionKeys[currentChat.id], "hex")
          ),
        };
      });

      setMessages?.((prev) => [...decryptedMessages, ...prev]);

      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop += 50; // Adjust the scroll position as needed
      }

      // wait for 1 second to simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?.id, messages?.length, noMoreMessages]);

  // Fetch messages for current conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat?.id) {
        setIsMessageLoading(true);

        const messageRes = await axiosAuth.get<MessageProps[]>(
          `/conversation/${currentChat?.id}/message`,
          {
            params: {
              page: 1,
              limit: 20,
            },
          }
        );

        // decrypt messages
        const decryptedMessages = messageRes?.data?.map((message) => {
          return {
            ...message,
            message: decryptMessage(
              JSON.parse(message.message),
              Buffer.from(sessionKeys[currentChat.id], "hex")
            ),
          };
        });

        setMessages?.(decryptedMessages);

        setNoMoreMessages(false);

        setIsMessageLoading(false);
      }
    };

    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?.id]);

  // Scroll to bottom of messages
  useEffect(() => {
    const timer = setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedUser?.id, currentChat?.last_message?.id]);

  // Mark messages as seen
  useEffect(() => {
    if (
      currentChat &&
      messages?.length &&
      !currentChat.last_message?.seen &&
      currentChat.last_message?.sender_id !== user?.id
    ) {
      const markMessagesAsSeen = async () => {
        const { data } = await axiosAuth.post(
          `/conversation/${currentChat?.id}/message/seen`
        );
      };

      markMessagesAsSeen();

      setCurrentChat?.((prev) => {
        return {
          ...(prev as any),
          last_message: {
            ...prev?.last_message,
            seen: true,
          },
        };
      });

      setConversations?.((prev) => {
        const index = prev.findIndex(
          (conversation) => conversation.id == currentChat?.id
        );
        const newConversations = [...prev];
        if (newConversations[index].last_message) {
          newConversations[index].last_message!.seen = true;
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

      socket.emit(EmitEvent.MarkMessageAsSeen, {
        conversation_id: currentChat?.id,
        sender_id: user?.id,
        receiver_id: selectedUser?.id,
        seen: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?.id, messages?.length, selectedUser?.id, user?.id]);

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
  }, [currentChat?.id]);

  // Observe the old message to fetch more messages when scrolling to the top
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !noMoreMessages) {
          fetchMoreMessages();
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
  }, [fetchMoreMessages, messages?.length, noMoreMessages]);

  return (
    <>
      <div
        id="messages"
        ref={chatContainerRef}
        onScroll={() => {
          if (
            chatContainerRef.current &&
            !noMoreMessages &&
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
        className="flex h-full flex-col space-y-4 overflow-auto p-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 [&>*:first-child]:mt-auto"
      >
        {messages?.length && !noMoreMessages ? (
          <span ref={loadingRef} className="flex justify-center">
            <LoadingSpinner />
          </span>
        ) : null}

        {messages?.length ? (
          messages?.map((message) => {
            return (
              <ChatMessage
                key={message.id}
                message={message.message}
                isSentByUser={user?.id == message.sender_id}
                isLastMessage={lastMessage?.id == message.id}
                isSeen={isLastMessageSeen}
              />
            );
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="mt-4 text-lg text-gray-400">
              No messages yet, start chatting
            </p>
          </div>
        )}
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
