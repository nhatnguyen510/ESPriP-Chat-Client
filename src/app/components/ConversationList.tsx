/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import setFormattedTime from "@/../lib/hooks/useFormattedTime";
import { useChatContext } from "@/../context/ChatProvider";
import { ConversationProps } from "@/../types";
import { useSession } from "next-auth/react";
import socket from "@/../lib/socket";
import { useMessages } from "@/../lib/hooks/useMessages";
import { ListenEvent } from "@/../lib/enum";

interface ConversationListProps {}

const ConversationList: React.FC<ConversationListProps> = () => {
  const {
    friendList,
    onlineFriends,
    selectedUser,
    setSelectedUser,
    conversations,
    setConversations,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    isLoading,
  } = useChatContext();

  const { data: session } = useSession();

  const conversationListRef = useRef<HTMLDivElement>(null);

  const sortedConversations = conversations
    ?.slice()
    .sort((a: ConversationProps, b: ConversationProps) => {
      return (
        new Date(b.last_message_at as string).getTime() -
        new Date(a.last_message_at as string).getTime()
      );
    });

  // Mark messages as seen
  useEffect(() => {
    const onMessagesSeen = (data: {
      conversation_id: string;
      sender_id: string;
      seen: boolean;
    }) => {
      if (data.conversation_id === currentChat?.id) {
        setMessages?.((messages) =>
          messages?.map((message) => {
            if (message.sender_id !== data.sender_id && !message.seen) {
              return { ...message, seen: true };
            }

            return message;
          })
        );

        setCurrentChat?.((currentChat) => {
          if (currentChat) {
            return {
              ...(currentChat as any),
              last_message: {
                ...currentChat.last_message,
                seen: true,
              },
            };
          }

          return currentChat;
        });
      }

      setConversations?.((conversations) =>
        conversations?.map((conversation) => {
          if (conversation.id === data.conversation_id) {
            return {
              ...(conversation as any),
              last_message: {
                ...conversation.last_message,
                seen: true,
              },
            };
          }

          return conversation;
        })
      );
    };

    socket.on(ListenEvent.MessageSeen, onMessagesSeen);

    return () => {
      socket.off("message_seen", onMessagesSeen);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, currentChat?.id, session?.user?.id]);

  console.log({ conversations, friendList });

  return (
    <div
      ref={conversationListRef}
      className={`conversation-list flex flex-1 flex-col gap-2`}
    >
      <p className="text-sm">All messages</p>
      {isLoading ? (
        <div
          role="status"
          className="max-w-md flex-1 animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      ) : sortedConversations?.length ? (
        sortedConversations?.map((conversation) => {
          const friend = friendList?.find(
            (friend) =>
              conversation?.participants_ids?.includes(friend?.id) || ""
          );

          const isOnline = onlineFriends?.includes(friend?.id as string);

          const formattedTime = setFormattedTime(
            conversation?.last_message_at as string
          );

          const { isLastMessageSeen, isOwnLastMessage } = useMessages(
            messages,
            conversation,
            session?.user?.id
          );

          return (
            <div
              key={conversation?.id}
              className={`delay-50 duration flex cursor-pointer items-center gap-2 rounded-md p-2 ease-in-out transition hover:bg-gray-100 ${
                selectedUser?.id === friend?.id ? "bg-gray-100" : ""
              }`}
              onClick={() => {
                setSelectedUser?.(friend as any);
                setCurrentChat?.(conversation);
              }}
            >
              <Avatar image={friend?.avatar_url} isOnline={isOnline} />
              <div className="flex h-full w-full flex-col justify-between">
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-sm font-semibold">{`${friend?.first_name} ${friend?.last_name}`}</p>
                  <p className="text-xs text-gray-500">{formattedTime}</p>
                </div>
                <p
                  className={`max-w-[150px] truncate text-xs lg:max-w-[160px] ${
                    !conversation.last_message?.seen && !isOwnLastMessage
                      ? "font-bold text-gray-800"
                      : "font-normal text-gray-500"
                  }`}
                >
                  {isOwnLastMessage && conversation.last_message
                    ? `You: ${conversation.last_message?.message}`
                    : `${conversation.last_message?.message || ""}`}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-gray-500">No conversations yet</p>
      )}
    </div>
  );
};

export default ConversationList;
