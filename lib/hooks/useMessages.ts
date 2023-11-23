import { ConversationProps, MessageProps } from "@/../types";

export const useMessages = (
  messages: MessageProps[] | undefined,
  conversation: ConversationProps | undefined | null,
  userId: string | undefined
) => {
  const lastMessage = conversation?.last_message;

  const isLastMessageSeen = conversation?.last_message?.seen;

  const isOwnLastMessage = conversation?.last_message?.sender_id === userId;

  return {
    lastMessage,
    isLastMessageSeen,
    isOwnLastMessage,
  };
};
