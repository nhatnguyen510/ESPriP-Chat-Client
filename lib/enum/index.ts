export enum ListenEvent {
  Error = "error",
  Success = "success",
  UserOnline = "user_online",
  UserOffline = "user_offline",
  OnlineFriends = "online_friends",
  MessageSent = "message_sent",
  ReceiveMessage = "receive_message",
  MessageSeen = "message_seen",
}

export enum EmitEvent {
  MarkMessageAsSeen = "mark_message_as_seen",
}

export enum Status {
  Online = "online",
  Offline = "offline",
}
