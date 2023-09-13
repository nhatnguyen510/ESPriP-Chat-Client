export type FriendType = {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatarUrl?: string;
};

export type currentChatType = ConversationProps;

export type MessageProps = {
  _id: string;
  sender_id: string;
  conversation_id: string;
  message: string;
  seen: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ConversationProps = {
  _id: string;
  participants: string[];
  createdAt?: string;
  updatedAt?: string;
  lastMessage?: MessageProps;
  lastMessageAt?: string;
};
