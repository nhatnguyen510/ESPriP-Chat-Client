"use client";

import React from "react";
import Image from "next/image";
import { useChatContext } from "@/../context/ChatProvider";

type chatHeaderProps = {};

const ChatHeader: React.FC<chatHeaderProps> = ({}) => {
  const { selectedUser, onlineFriends } = useChatContext();

  const isOnline = onlineFriends?.includes(selectedUser?._id as string);

  console.log({ selectedUser });

  return (
    <>
      <div className="flex h-24 justify-between border-b-2 border-gray-200 p-3 sm:items-center">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div
              className={`absolute bottom-0 right-0 h-4 w-4 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-500"
              }`}
            ></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-2xl font-bold text-white sm:h-16 sm:w-16">
              <span>{selectedUser?.username?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="mt-1 flex items-center text-xl md:text-2xl">
              <span className="mr-3 font-semibold text-gray-700">
                {selectedUser?.username}
              </span>
            </div>
            <span className="text-lg text-gray-600 md:text-xl">
              {selectedUser?.username}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out focus:outline-none hover:bg-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out focus:outline-none hover:bg-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out focus:outline-none hover:bg-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
