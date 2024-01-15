"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FriendProps,
  ConversationProps,
  MessageProps,
  FriendRequestProps,
  SessionKey,
} from "../types";
import { useSession } from "next-auth/react";
import socket from "../lib/socket";
import { createDiffieHellman, DiffieHellman, randomBytes } from "crypto";
import {
  useSessionExpiredModalStore,
  useSessionKeysStore,
} from "../lib/zustand/store";
import useRefreshToken from "../lib/hooks/useRefreshToken";
import useAxiosAuth from "../lib/hooks/useAxiosAuth";
import { ListenEvent, Status } from "../lib/enum";
import toast from "react-hot-toast";
import {
  decryptMessage,
  decryptSessionKey,
  deriveSessionKey,
  encryptSessionKey,
} from "../lib/encryption";

type ChatContextType = {
  currentChat: ConversationProps | null;
  setCurrentChat: React.Dispatch<
    React.SetStateAction<ConversationProps | null>
  >;
  selectedUser: FriendProps | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<FriendProps | null>>;
  messages: MessageProps[];
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
  friendList: FriendProps[];
  setFriendList: React.Dispatch<React.SetStateAction<FriendProps[]>>;
  friendRequestsList: FriendRequestProps[];
  setFriendRequestsList: React.Dispatch<
    React.SetStateAction<FriendRequestProps[]>
  >;
  sentFriendRequests: FriendProps[];
  setSentFriendRequests: React.Dispatch<React.SetStateAction<FriendProps[]>>;
  onlineFriends: string[];
  setOnlineFriends: React.Dispatch<React.SetStateAction<string[]>>;
  conversations: ConversationProps[] | null;
  setConversations: React.Dispatch<React.SetStateAction<ConversationProps[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  keys: React.MutableRefObject<DiffieHellman | null>;
};

export const ChatContext = React.createContext<Partial<ChatContextType>>({});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentChat, setCurrentChat] = useState<ConversationProps | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<FriendProps | null>(null);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [friendList, setFriendList] = useState<FriendProps[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<string[]>([]);
  const [conversations, setConversations] = useState<ConversationProps[]>([]);
  const [friendRequestsList, setFriendRequestsList] = useState<
    FriendRequestProps[]
  >([]);
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendProps[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const keys = useRef<DiffieHellman | null>(null);
  const { data: session, status, update } = useSession();
  const axiosAuth = useAxiosAuth();
  const refreshToken = useRefreshToken(session?.user);
  const { open } = useSessionExpiredModalStore();
  const { sessionKeys, setSessionKeys } = useSessionKeysStore();

  useEffect(() => {
    // get all friends, conversations, sent friend requests, and friend requests list
    const fetchAll = async () => {
      setIsLoading?.(true);

      const friendsData = axiosAuth.get<FriendProps[]>(`/friends`);
      const conversationsData =
        axiosAuth.get<ConversationProps[]>(`/conversation`);
      const sentFriendRequestsData = axiosAuth.get<FriendProps[]>(
        `/friends/requests/sent`
      );
      const friendRequestsListData =
        axiosAuth.get<FriendRequestProps[]>(`/friends/requests`);

      const sessionKeysData = axiosAuth.get<SessionKey[]>(
        "/encryption/session-keys"
      );

      const [
        friendsRes,
        conversationsRes,
        sentFriendRequestRes,
        friendRequestsRes,
        sessionKeysRes,
      ] = await Promise.all([
        friendsData,
        conversationsData,
        sentFriendRequestsData,
        friendRequestsListData,
        sessionKeysData,
      ]);

      const sessionKeys: Record<string, string> = sessionKeysRes?.data?.reduce(
        (acc, curr) => {
          const decryptedKey = decryptSessionKey(
            { iv: curr.iv, encryptedData: curr.encrypted_key },
            Buffer.from(session?.user?.master_key as string, "hex")
          );
          return {
            ...acc,
            [curr.conversation_id]: decryptedKey,
          };
        },
        {}
      );

      const decryptedConversations = conversationsRes?.data?.map(
        (conversation) => {
          console.log("conversation: ", conversation);
          const encryptedLastMessage = conversation?.last_message?.message;

          console.log("encryptedLastMessage: ", encryptedLastMessage);

          if (!encryptedLastMessage) return conversation;

          const { iv, encryptedData } = JSON.parse(
            encryptedLastMessage as string
          );

          const decryptedLastMessage = decryptMessage(
            {
              iv,
              encryptedData,
            },
            Buffer.from(sessionKeys?.[conversation.id] as string, "hex")
          );

          return {
            ...conversation,
            last_message: {
              ...(conversation.last_message as MessageProps),
              message: decryptedLastMessage,
            },
          };
        }
      );

      setSessionKeys?.(sessionKeys);
      setConversations?.(decryptedConversations);
      setFriendList?.(friendsRes?.data);
      setSentFriendRequests?.(sentFriendRequestRes?.data);
      setFriendRequestsList?.(friendRequestsRes?.data);

      setIsLoading?.(false);
    };

    status == "authenticated" && fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosAuth, session?.user?.master_key, status]);

  useEffect(() => {
    // check if there exists a session key for each conversation
    // if not, create one and save it to the database
    conversations?.forEach(async (conversation) => {
      if (!sessionKeys?.[conversation.id]) {
        const friend = friendList?.find((friend) =>
          conversation.participants_ids.includes(friend.id)
        );

        const sessionKey = deriveSessionKey(
          keys?.current as DiffieHellman,
          friend?.friend_public_key as string
        );

        const encryptedSessionKey = encryptSessionKey(
          sessionKey,
          Buffer.from(session?.user?.master_key as string, "hex")
        );

        const { data: encryptionData } = await axiosAuth.post<SessionKey>(
          "/encryption/session-key",
          {
            encrypted_key: encryptedSessionKey.encryptedData,
            conversation_id: conversation.id,
            iv: encryptedSessionKey.iv,
          }
        );

        setSessionKeys?.((prev) => ({
          ...(prev as any),
          [conversation.id]: sessionKey,
        }));
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // connect socket
  useEffect(() => {
    function connectSocket() {
      socket.auth = { token: session?.user.access_token };
      socket.connect();

      socket.on("connect_error", async (err) => {
        console.log("Error connecting to socket: ", err);
        socket.close();

        try {
          const { access_token, refresh_token } = await refreshToken();

          await update({
            access_token,
            refresh_token,
          });

          socket.auth = { token: access_token };

          socket.connect();
        } catch (err) {
          console.log("Error refreshing token: ", err);
          open();
        }
      });

      socket.once(
        "prime_and_generator",
        (data: { prime: string; generator: string }) => {
          console.log("Prime and Generator: ", {
            prime: data.prime,
            generator: data.generator,
          });

          keys.current = createDiffieHellman(
            data.prime,
            "hex",
            data.generator as any
          );

          const existedPublicKey = localStorage.getItem("publicKey");
          const existedPrivateKey = localStorage.getItem("privateKey");

          console.log({ existedPublicKey, existedPrivateKey });
          if (!existedPublicKey || !existedPrivateKey) {
            keys.current.generateKeys();

            //save keys in local storage
            localStorage.setItem(
              "privateKey",
              keys.current.getPrivateKey("hex")
            );
            localStorage.setItem("publicKey", keys.current.getPublicKey("hex"));
          } else {
            keys.current.setPrivateKey(Buffer.from(existedPrivateKey, "hex"));
            keys.current.setPublicKey(Buffer.from(existedPublicKey, "hex"));
          }
        }
      );

      socket.on(
        ListenEvent.FriendRequestAccepted,
        async (data: {
          conversation: ConversationProps;
          friendRequest: FriendRequestProps;
        }) => {
          console.log("friend request accepted", data);
          toast.success(
            `${data.friendRequest.accepted_user.username} accepted your friend request`
          );

          setSentFriendRequests?.((prev) =>
            prev?.filter(
              (friend) => friend.id !== data.friendRequest.accepted_user.id
            )
          );

          setFriendList?.((prev) => [
            ...prev,
            {
              ...data.friendRequest.accepted_user,
              friend_public_key: data.friendRequest.accepted_user_public_key,
            },
          ]);

          setConversations?.((prev) => [...prev, data.conversation]);

          const sessionKey = deriveSessionKey(
            keys?.current as DiffieHellman,
            data.friendRequest.accepted_user_public_key
          );

          const encryptedSessionKey = encryptSessionKey(
            sessionKey,
            Buffer.from(session?.user?.master_key as string, "hex")
          );

          const { data: encryptionData } = await axiosAuth.post<SessionKey>(
            "/encryption/session-key",
            {
              encrypted_key: encryptedSessionKey.encryptedData,
              conversation_id: data.conversation.id,
              iv: encryptedSessionKey.iv,
            }
          );

          console.log("sessionKey on listen event: ", sessionKey);

          setSessionKeys?.((prev) => ({
            ...(prev as any),
            [data.conversation.id]: sessionKey,
          }));
        }
      );
    }

    if (status === "authenticated") {
      connectSocket();
    }

    return () => {
      socket.off("connect_error");
      socket.off("prime_and_generator");
      socket.off(ListenEvent.FriendRequestAccepted);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, status]);

  useEffect(() => {
    const onUserOnline = (data: { userId: string; status: string }) => {
      if (
        data.status == Status.Online &&
        !onlineFriends?.includes(data.userId) &&
        data.userId !== session?.user?.id
      ) {
        setOnlineFriends?.((prev) => [...prev, data.userId]);
      }
    };
    const onUserOffline = (data: { userId: string; status: string }) => {
      if (data.status == Status.Offline) {
        setOnlineFriends?.((prev) =>
          prev?.filter((friendId) => friendId !== data.userId)
        );
      }
    };
    const onFriendsOnline = (data: any) => {
      setOnlineFriends?.(data);
    };

    socket.on(ListenEvent.UserOnline, onUserOnline);

    socket.on(ListenEvent.UserOffline, onUserOffline);

    socket.on(ListenEvent.OnlineFriends, onFriendsOnline);

    return () => {
      socket.off(ListenEvent.UserOnline, onUserOnline);
      socket.off(ListenEvent.UserOffline, onUserOffline);
      socket.off(ListenEvent.OnlineFriends, onFriendsOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineFriends]);

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        setCurrentChat,
        selectedUser,
        setSelectedUser,
        messages,
        setMessages,
        friendList,
        setFriendList,
        friendRequestsList,
        setFriendRequestsList,
        sentFriendRequests,
        setSentFriendRequests,
        onlineFriends,
        setOnlineFriends,
        conversations,
        setConversations,
        isLoading,
        setIsLoading,
        keys,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
