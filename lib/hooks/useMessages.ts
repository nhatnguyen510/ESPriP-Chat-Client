import { ConversationProps, MessageProps } from "../../types/types";

export const useMessages = (
  messages: MessageProps[] | undefined,
  conversation: ConversationProps | undefined | null,
  userId: string | undefined
) => {
  const lastMessage = messages?.[messages?.length - 1];

  const isLastMessageSeen = messages?.[messages?.length - 1]?.seen;

  const isSeen = conversation?.last_message?.seen;

  const isOwnLastMessage =
    messages?.[messages?.length - 1]?.sender_id === userId;

  const noMoreMessages = messages!.length % 20 !== 0;

  return {
    lastMessage,
    isLastMessageSeen,
    isSeen,
    isOwnLastMessage,
    noMoreMessages,
  };
};
