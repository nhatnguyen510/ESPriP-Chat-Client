/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import setFormattedTime from "@/../lib/hooks/useFormattedTime";
import { useChatContext } from "@/../context/ChatProvider";
import { ConversationProps } from "@/../types/types";
import { useSession } from "next-auth/react";
import socket from "@/../lib/socket";
import { useMessages } from "@/../lib/hooks/useMessages";

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
  } = useChatContext();

  const { data: session } = useSession();

  const conversationListRef = useRef<HTMLDivElement>(null);

  const sortedConversations = conversations
    ?.slice()
    .sort((a: ConversationProps, b: ConversationProps) => {
      return (
        new Date(b.lastMessageAt as string).getTime() -
        new Date(a.lastMessageAt as string).getTime()
      );
    });

  // // Mark messages as seen
  // useEffect(() => {
  //   const onMessagesSeen = (data: {
  //     conversation_id: string;
  //     sender_id: string;
  //     seen: boolean;
  //   }) => {
  //     console.log("onMessagesSeen", { data });

  //     if (data.conversation_id === currentChat?.id) {
  //       setMessages?.((messages) =>
  //         messages?.map((message) => {
  //           if (message.sender_id !== data.sender_id && !message.seen) {
  //             return { ...message, seen: true };
  //           }

  //           return message;
  //         })
  //       );

  //       setCurrentChat?.((currentChat) => {
  //         if (currentChat) {
  //           return {
  //             ...(currentChat as any),
  //             lastMessage: {
  //               ...currentChat.lastMessage,
  //               seen: true,
  //             },
  //           };
  //         }

  //         return currentChat;
  //       });
  //     }

  //     setConversations?.((conversations) =>
  //       conversations?.map((conversation) => {
  //         if (conversation.id === data.conversation_id) {
  //           return {
  //             ...(conversation as any),
  //             lastMessage: {
  //               ...conversation.lastMessage,
  //               seen: true,
  //             },
  //           };
  //         }

  //         return conversation;
  //       })
  //     );
  //   };

  //   socket.on("messagesSeen", onMessagesSeen);

  //   return () => {
  //     socket.off("messagesSeen", onMessagesSeen);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [conversations, currentChat?.id, session?.user?.id]);

  console.log({ currentChat });

  return (
    <div
      ref={conversationListRef}
      className={`conversation-list flex flex-col gap-2`}
    >
      <p className="text-sm">All messages</p>
      {sortedConversations?.length ? (
        sortedConversations.map((conversation) => {
          const friend = friendList?.find(
            (friend) =>
              conversation?.participantsIds?.includes(friend?.id) || ""
          );

          const isOnline = onlineFriends?.includes(friend?.id as string);

          const formattedTime = setFormattedTime(
            conversation?.lastMessageAt as string
          );

          // const isOwnLastMessage =
          //   conversation.lastMessage?.sender_id === session?.user?.id;

          // const isSeen = conversation.lastMessage?.seen;

          // const isLastMessageSeen = messages?.[messages?.length - 1]?.seen;

          // console.log({ isOwnLastMessage, isSeen, isLastMessageSeen });

          const { isLastMessageSeen, isSeen, isOwnLastMessage } = useMessages(
            messages,
            conversation,
            session?.user?.id
          );

          return (
            <div
              key={conversation?.id}
              className={`delay-50 duration flex cursor-pointer items-center gap-2 rounded-md p-2 transition ease-in-out hover:bg-gray-100 ${
                selectedUser?.id === friend?.id ? "bg-gray-100" : ""
              }`}
              onClick={() => {
                setSelectedUser?.(friend as any);
                setCurrentChat?.(conversation);
              }}
            >
              <Avatar image={friend?.avatarUrl} isOnline={isOnline} />
              <div className="flex h-full w-full flex-col justify-between">
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-sm font-semibold">{friend?.username}</p>
                  <p className="text-xs text-gray-500">{formattedTime}</p>
                </div>
                <p
                  className={`max-w-[170px] truncate text-xs ${
                    !conversation.lastMessage?.seen && !isOwnLastMessage
                      ? "font-bold text-gray-800"
                      : "font-normal text-gray-500"
                  }`}
                >
                  {isOwnLastMessage && conversation.lastMessage
                    ? `You: ${conversation.lastMessage?.message}`
                    : `${conversation.lastMessage?.message || ""}`}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-gray-500">No messages</p>
      )}
    </div>
  );
};

export default ConversationList;
