import { FriendStatus } from "../lib/enum";

export type FriendProps = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  friend_public_key?: string;
};

export type CurrentChatProps = ConversationProps;

export type MessageProps = {
  id: string;
  sender_id: string;
  conversation_id: string;
  message: string;
  iv: string;
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

export type FriendRequestProps = {
  id: string;
  status: FriendStatus;
  requested_user_id: string;
  accepted_user_id: string;
  requested_user: FriendProps;
  accepted_user: FriendProps;
  requested_user_public_key: string;
  accepted_user_public_key: string;
  created_at?: string;
  updated_at?: string;
};

export type SessionKey = {
  id: string;
  user_id: string;
  conversation_id: string;
  encrypted_key: string;
  iv: string;
  created_at?: string;
  updated_at?: string;
};

export type Keys = {
  id: string;
  user_id: string;
  public_key: string;
  encrypted_private_key: string;
  iv: string;
  created_at?: string;
  updated_at?: string;
};
