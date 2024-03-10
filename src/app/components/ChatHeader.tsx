"use client";

import React from "react";
import Image from "next/image";
import { useChatContext } from "@/../context/ChatProvider";

type chatHeaderProps = {};

const ChatHeader: React.FC<chatHeaderProps> = ({}) => {
  const { selectedUser, onlineFriends } = useChatContext();

  const isOnline = onlineFriends?.includes(selectedUser?.id as string);

  return (
    <>
      <div className="flex h-24 justify-between border-b-2 border-gray-200 p-3 sm:items-center">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div
              className={`absolute bottom-0 right-0 z-10 h-4 
              w-4  rounded-full ring-2 ring-white ${
                isOnline ? "bg-green-500" : "bg-gray-500"
              }`}
            ></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-2xl font-bold text-white sm:h-16 sm:w-16">
              <Image
                src={selectedUser?.avatar_url || "/no-avatar.png"}
                alt="Avatar"
                fill
                className="rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="mt-1 flex items-center text-xl md:text-2xl">
              <span className="mr-3 font-semibold text-gray-700">
                {`${selectedUser?.first_name} ${selectedUser?.last_name}`}
              </span>
            </div>
            <span className="text-lg text-gray-600 md:text-xl">
              @{selectedUser?.username}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
