export enum ListenEvent {
  Error = "error",
  Success = "success",
  UserOnline = "user_online",
  UserOffline = "user_offline",
  OnlineFriends = "online_friends",
  MessageSent = "message_sent",
  ReceiveMessage = "receive_message",
  MessageSeen = "message_seen",
  FriendRequestAccepted = "friend_request_accepted",
  FriendRequestReceived = "friend_request_received",
}

export enum EmitEvent {
  MarkMessageAsSeen = "mark_message_as_seen",
  SendFriendRequest = "send_friend_request",
}

export enum Status {
  Online = "online",
  Offline = "offline",
}

export enum FriendStatus {
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected",
}
