"use client";

import React, { useState } from "react";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import { CurrentUserReturnType } from "@/../lib/session";
import { useChatContext } from "@/../context/ChatProvider";
import socket from "@/../lib/socket";
import { useSession } from "next-auth/react";
import { MessageProps, ConversationProps } from "../../../types/types";

type chatInputProps = {
  user?: CurrentUserReturnType;
};

const ChatInput: React.FC<chatInputProps> = ({ user }) => {
  const [textInput, setTextInput] = useState<string>("");
  const axiosAuth = useAxiosAuth(user);
  const {
    currentChat,
    setCurrentChat,
    setMessages,
    selectedUser,
    setConversations,
  } = useChatContext();

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const onSendMessage = async () => {
    console.log({ textInput });

    try {
      if (currentChat) {
        const res = await axiosAuth.post<{
          savedMessage: MessageProps;
          updatedConversation: ConversationProps;
        }>(`/conversation/${currentChat.id}/message`, {
          message: textInput,
        });
        const sentMessage = res.data.savedMessage;
        const updatedConversation = res.data.updatedConversation;

        console.log({ sentMessage, updatedConversation });

        // socket.emit("sendMessage", {
        //   id: sentMessage.id,
        //   conversation_id: sentMessage.conversation_id,
        //   sender_id: user?.id,
        //   receiver_id: selectedUser?.id,
        //   seen: sentMessage.seen,
        //   message: textInput,
        //   lastMessage: updatedConversation.lastMessage,
        //   lastMessageAt: updatedConversation.lastMessageAt,
        // });

        setMessages?.((prev) => [...prev, sentMessage]);

        setCurrentChat?.((prev) => {
          return {
            ...(prev as any),
            last_message: updatedConversation.last_message,
            last_message_at: updatedConversation.last_message_at,
          };
        });

        // Update lastMessage and lastMessageAt in conversations
        setConversations?.((prev) => {
          const index = prev.findIndex(
            (conversation) => conversation.id == updatedConversation.id
          );
          const newConversations = [...prev];
          newConversations[index].last_message_at =
            updatedConversation.last_message_at;
          newConversations[index].last_message =
            updatedConversation.last_message;
          return newConversations;
        });

        setTextInput("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="mb-2 h-16 border-t-2 border-gray-200 p-2">
        <div className="relative flex rounded-xl bg-gray-200">
          <span className="flex items-center">
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-gray-500 transition duration-500 ease-in-out focus:outline-none hover:bg-gray-300"
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
            className="w-full break-words rounded-md bg-inherit py-3 text-gray-600 placeholder-gray-600 focus:placeholder-gray-400 focus:outline-none"
          />{" "}
          {/* <textarea
            value={textInput}
            onChange={onChangeInput}
            rows={1}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Write your message here..."
          /> */}
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition duration-500 ease-in-out focus:outline-none hover:bg-gray-300"
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
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition duration-500 ease-in-out focus:outline-none hover:bg-gray-300"
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
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition duration-500 ease-in-out focus:outline-none hover:bg-gray-300"
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
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              onClick={onSendMessage}
              className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-4 py-3 text-white transition duration-500 ease-in-out focus:outline-none hover:bg-blue-400"
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
