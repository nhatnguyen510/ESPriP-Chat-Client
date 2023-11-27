"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { FriendProps, ConversationProps, MessageProps } from "../types";
import { getCsrfToken, getSession, useSession } from "next-auth/react";
import socket from "../lib/socket";
import { createDiffieHellman, DiffieHellman } from "crypto";
import { refresh } from "../lib/api/auth";
import { useSessionExpiredModalStore } from "../lib/zustand/store";
import useRefreshToken from "../lib/hooks/useRefreshToken";

type ChatContextType = {
  currentChat: ConversationProps | null;
  setCurrentChat: React.Dispatch<
    React.SetStateAction<ConversationProps | null>
  >;
  selectedUser: FriendProps | null | undefined;
  setSelectedUser: React.Dispatch<React.SetStateAction<FriendProps | null>>;
  messages: MessageProps[];
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
  friendList: FriendProps[];
  setFriendList: React.Dispatch<React.SetStateAction<FriendProps[]>>;
  onlineFriends: string[];
  setOnlineFriends: React.Dispatch<React.SetStateAction<string[]>>;
  conversations: ConversationProps[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationProps[]>>;
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
  const keys = useRef<DiffieHellman | null>(null);
  const { data: session, status, update } = useSession();
  const refreshToken = useRefreshToken(session?.user);
  const { open } = useSessionExpiredModalStore();

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
    }

    if (status === "authenticated") {
      connectSocket();
    }

    // socket.on("primeAndGenerator", (data) => {
    //   console.log("Prime and Generator: ", data);

    //   if (
    //     !localStorage.getItem("publicKey") ||
    //     !localStorage.getItem("privateKey")
    //   ) {
    //     const newKeys = createDiffieHellman(data.prime, data.generator);
    //     newKeys.generateKeys();

    //     //save keys in local storage
    //     localStorage.setItem("privateKey", newKeys.getPrivateKey("hex"));
    //     localStorage.setItem("publicKey", newKeys.getPublicKey("hex"));
    //   } else {
    //     keys.current = createDiffieHellman(data.prime, data.generator);
    //     keys.current.setPrivateKey(
    //       Buffer.from(localStorage.getItem("privateKey") as string, "hex")
    //     );
    //     keys.current.setPublicKey(
    //       Buffer.from(localStorage.getItem("publicKey") as string, "hex")
    //     );

    //     console.log(
    //       "Keys: ",
    //       keys.current.getPrivateKey("hex"),
    //       keys.current.getPublicKey("hex")
    //     );
    //   }
    // });

    return () => {
      socket.off("connect_error");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, status]);

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
        onlineFriends,
        setOnlineFriends,
        conversations,
        setConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
