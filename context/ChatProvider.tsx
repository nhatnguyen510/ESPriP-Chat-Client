"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { FriendType } from "../types/types";
import { useSession } from "next-auth/react";
import socket from "../lib/socket";
import { createDiffieHellman, DiffieHellman } from "crypto";

type ChatContextType = {
  currentChat: currentChatType | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<currentChatType | null>>;
  selectedUser: FriendType | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<FriendType | null>>;
  messages: MessageProps[];
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
  onlineFriends: string[];
  setOnlineFriends: React.Dispatch<React.SetStateAction<string[]>>;
};

type currentChatType = {
  _id: string;
  participants: string[];
};

type MessageProps = {
  _id: string;
  sender_id: string;
  conversation_id: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
};

export const ChatContext = React.createContext<Partial<ChatContextType>>({});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentChat, setCurrentChat] = useState<currentChatType | null>(null);
  const [selectedUser, setSelectedUser] = useState<FriendType | null>(null);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<string[]>([]);
  const { data: session } = useSession();
  const keys = useRef<DiffieHellman | null>(null);

  useEffect(() => {
    socket.auth = { userId: session?.user?.id };
    socket.connect();

    socket.on("primeAndGenerator", (data) => {
      console.log("Prime and Generator: ", data);

      if (
        !localStorage.getItem("publicKey") ||
        !localStorage.getItem("privateKey")
      ) {
        const newKeys = createDiffieHellman(data.prime, data.generator);
        newKeys.generateKeys();

        //save keys in local storage
        localStorage.setItem("privateKey", newKeys.getPrivateKey("hex"));
        localStorage.setItem("publicKey", newKeys.getPublicKey("hex"));
      } else {
        keys.current = createDiffieHellman(data.prime, data.generator);
        keys.current.setPrivateKey(
          Buffer.from(localStorage.getItem("privateKey") as string, "hex")
        );
        keys.current.setPublicKey(
          Buffer.from(localStorage.getItem("publicKey") as string, "hex")
        );

        console.log(
          "Keys: ",
          keys.current.getPrivateKey("hex"),
          keys.current.getPublicKey("hex")
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.user?.id]);

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        setCurrentChat,
        selectedUser,
        setSelectedUser,
        messages,
        setMessages,
        onlineFriends,
        setOnlineFriends,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
