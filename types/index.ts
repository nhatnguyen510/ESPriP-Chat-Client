export type FriendProps = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
};

export type CurrentChatProps = ConversationProps;

export type MessageProps = {
  id: string;
  sender_id: string;
  conversation_id: string;
  message: string;
  seen: boolean;
  sender: FriendProps;
  created_at?: string;
  updated_at?: string;
};

export type ConversationProps = {
  id: string;
  participants_ids: string[];
  created_at?: string;
  updated_at?: string;
  last_message?: MessageProps;
  last_message_id?: string;
  last_message_at?: string;
};
