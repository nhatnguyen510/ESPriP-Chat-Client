export type FriendType = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatarUrl?: string;
};

export type currentChatType = ConversationProps;

export type MessageProps = {
  id: string;
  sender_id: string;
  conversation_id: string;
  message: string;
  seen: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ConversationProps = {
  id: string;
  participantsIds: string[];
  createdAt?: string;
  updatedAt?: string;
  lastMessage?: MessageProps;
  lastMessageAt?: string;
};
