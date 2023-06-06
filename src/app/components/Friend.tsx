import React from "react";
import Img from "next/image";
import { FriendType } from "../../../types/types";

const Friend: React.FC<FriendType> = ({
  _id,
  username,
  first_name,
  last_name,
  avatarUrl,
  isOnline,
  lastMessage,
}) => {
  return (
    <div className="flex cursor-pointer items-center border-b border-gray-300 py-4 pr-2">
      <div className="relative mr-4 flex ">
        <Img
          width={0}
          height={0}
          src={avatarUrl ? avatarUrl : "/avatar-cute-2.jpeg"}
          alt="Avatar"
          className="h-12 w-12 rounded-full"
        />
        <div
          className={`absolute bottom-0 right-0 h-4 w-4 rounded-full ${
            isOnline ? "bg-green-500" : "bg-gray-500"
          }`}
        ></div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold">{username}</h3>
        <p className="text-gray-500">{lastMessage}</p>
      </div>
    </div>
  );
};

export default Friend;
