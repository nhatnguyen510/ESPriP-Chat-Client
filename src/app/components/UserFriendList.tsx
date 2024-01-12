"use client";

import React from "react";
import { CurrentUserReturnType } from "@/../lib/session";
import UserSettings from "./UserSettings";
import { useSession } from "next-auth/react";

type sideBarProps = {
  user?: CurrentUserReturnType;
};

const UserFriendList: React.FC<sideBarProps> = ({ user }) => {
  const fakeFriendsData = [
    {
      id: 1,
      avatarUrl:
        "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
      name: "Friend 1",
      message: "Last message sent by Friend 1",
      isOnline: true,
    },
    {
      id: 2,
      avatarUrl:
        "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
      name: "Friend 2",
      message: "Last message sent by Friend 2",
      isOnline: false,
    },
    {
      id: 3,
      avatarUrl:
        "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
      name: "Friend 3",
      message: "Last message sent by Friend 3",
      isOnline: true,
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center border-r p-4">
      <h2 className="mb-4 text-lg font-bold">Messages</h2>
      <div className="mb-4 w-full">
        <input
          type="text"
          placeholder="Search friend"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default UserFriendList;
