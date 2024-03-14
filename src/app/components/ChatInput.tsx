"use client";

import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import { CurrentUserReturnType } from "@/../lib/session";
import { useChatContext } from "@/../context/ChatProvider";
import socket from "@/../lib/socket";
import { MessageProps, ConversationProps } from "@/../types";
import { ListenEvent } from "@/../lib/enum";
import { useSessionKeysStore } from "@/../lib/zustand/store";
import { decryptMessage, encryptMessage } from "@/../lib/encryption";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { FaRegImage } from "react-icons/fa6";

type chatInputProps = {};

const ChatInput: React.FC<chatInputProps> = () => {
  const [textInput, setTextInput] = useState<string>("");
  const axiosAuth = useAxiosAuth();
  const {
    currentChat,
    setCurrentChat,
    setMessages,
    selectedUser,
    setConversations,
  } = useChatContext();

  const { sessionKeys } = useSessionKeysStore();

  const currentSessionKey = useMemo(() => {
    return sessionKeys?.[currentChat?.id as string];
  }, [currentChat?.id, sessionKeys]);

  const fileInputRef = useRef<HTMLInputElement | null>();

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "esprip-chat-images");

    const uploadResponse = await fetch(
      "https://api.cloudinary.com/v1_1/dicuu83mu/image/upload",
      {
        method: "POST",
        body: formData as any,
      }
    );

    const uploadResult = await uploadResponse.json();

    console.log("uploadResult: ", uploadResult);

    return uploadResult.secure_url;
  };

  const onDropImage = async (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("Dropped");

    const files = e.dataTransfer.files;
    console.log(files);

    const file = files[0];

    if (!file.type.startsWith("image")) {
      toast.error("Invalid file type");
      return;
    }

    const imageUrl = await uploadImage(file);

    await onSendMessage(imageUrl);
  };

  const onSendMessage = async (message: string) => {
    const encryptedMessage = encryptMessage(
      message,
      Buffer.from(currentSessionKey as string, "hex")
    );

    try {
      if (currentChat) {
        const result = await axiosAuth.post(
          `/conversation/${currentChat.id}/message`,
          {
            message: encryptedMessage.encryptedData,
            iv: encryptedMessage.iv,
          }
        );

        setTextInput("");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    socket.on(
      ListenEvent.MessageSent,
      (data: {
        message: MessageProps;
        updatedConversation: ConversationProps;
      }) => {
        const sentMessage = data.message;
        const updatedConversation = data.updatedConversation;

        // decrypt message
        const decryptedMessage = {
          ...sentMessage,
          message: decryptMessage(
            {
              iv: sentMessage.iv,
              encryptedData: sentMessage.message,
            },
            Buffer.from(sessionKeys[updatedConversation.id], "hex")
          ),
        };

        console.log("decryptedMessage: ", decryptedMessage);

        const decryptedUpdatedConversation: ConversationProps = {
          ...updatedConversation,
          last_message: decryptedMessage,
        };

        if (currentChat?.id == updatedConversation.id) {
          setMessages?.((prev) => [...prev, decryptedMessage]);
          setCurrentChat?.(decryptedUpdatedConversation);
        }

        // Update lastMessage and lastMessageAt in conversations
        setConversations?.((prev) => {
          const index = prev.findIndex(
            (conversation) => conversation.id == decryptedUpdatedConversation.id
          );
          const newConversations = [...prev];
          newConversations[index] = decryptedUpdatedConversation;

          return newConversations;
        });
      }
    );

    return () => {
      socket.off(ListenEvent.MessageSent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?.id]);

  console.log("currentSessionKey: ", currentSessionKey);

  return (
    <>
      <div className="mb-2 h-16 border-t-2 border-gray-200 p-2">
        <div className="relative flex rounded-xl bg-gray-200">
          <span className="flex items-center">
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-gray-500 duration-500 ease-in-out transition hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                ></path>
              </svg>
            </button>
          </span>
          <input
            type="text"
            placeholder="Write your message!"
            value={textInput}
            onChange={onChangeInput}
            onDrop={onDropImage}
            className="w-full break-words rounded-md bg-inherit py-3 text-gray-600 placeholder-gray-600 focus:placeholder-gray-400 focus:outline-none"
          />{" "}
          <div className="flex items-center">
            <button
              onClick={() => fileInputRef?.current?.click()}
              className="mx-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 duration-500 ease-in-out transition hover:bg-gray-300 focus:outline-none"
            >
              <FaRegImage className="h-6 w-6 text-gray-600" />
            </button>
            <input
              ref={fileInputRef as MutableRefObject<HTMLInputElement>}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={async (e) => {
                e.preventDefault();
                const file = e.target.files?.[0];
                if (file) {
                  const imageUrl = await uploadImage(file);
                  await onSendMessage(imageUrl);
                }
              }}
            />
            <button
              type="button"
              onClick={() => onSendMessage(textInput)}
              className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-4 py-3 text-white duration-500 ease-in-out transition hover:bg-blue-400 focus:outline-none"
            >
              <span className="font-bold">Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ml-2 h-6 w-6 rotate-90 transform"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
