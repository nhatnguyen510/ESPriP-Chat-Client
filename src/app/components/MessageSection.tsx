"use client";

import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsSearch } from "react-icons/bs";
import Avatar from "@/app/components/Avatar";
import { useChatContext } from "@/../context/ChatProvider";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import { CurrentUserReturnType, getCurrentUser } from "@/../lib/session";
import socket from "@/../lib/socket";
import { ConversationProps, FriendProps } from "@/../types";
import { format, parseISO } from "date-fns";
import ConversationList from "./ConversationList";
import Button from "./Button";
import { AxiosResponse } from "axios";
import { ListenEvent, Status } from "@/../lib/enum";
import { useSession } from "next-auth/react";

interface MessageSectionProps {}

const MessageSection: React.FC<MessageSectionProps> = () => {
  const axiosAuth = useAxiosAuth();

  const fakeOnlineFriends = [
    "60f9a1a0b3b3a1b4a8a0b3b3",
    "60f9a1a0b3b3a1b4a8a0b3b4",
    "60f9a1a0b3b3a1b4a8a0b3b5",
    "60f9a1a0b3b3a1b4a8a0b3b6",
    "60f9a1a0b3b3a1b4a8a0b3b7",
  ];

  const fakeFriendList: FriendProps[] = [
    {
      id: "60f9a1a0b3b3a1b4a8a0b3b3",
      username: "test1",
      avatar_url: "https://i.pravatar.cc/150?img=1",
      first_name: "test1",
      last_name: "test1",
    },
    {
      id: "60f9a1a0b3b3a1b4a8a0b3b4",
      username: "test2",
      avatar_url: "https://i.pravatar.cc/150?img=2",
      first_name: "test2",
      last_name: "test2",
    },
    {
      id: "60f9a1a0b3b3a1b4a8a0b3b5",
      username: "test3",
      avatar_url: "https://i.pravatar.cc/150?img=3",
      first_name: "test3",
      last_name: "test3",
    },
    {
      id: "60f9a1a0b3b3a1b4a8a0b3b6",
      username: "test4",
      avatar_url: "https://i.pravatar.cc/150?img=4",
      first_name: "test4",
      last_name: "test4",
    },
    {
      id: "60f9a1a0b3b3a1b4a8a0b3b7",
      username: "test5",
      avatar_url: "https://i.pravatar.cc/150?img=5",
      first_name: "test5",
      last_name: "test5",
    },
  ];

  const {
    currentChat,
    setCurrentChat,
    friendList,
    setFriendList,
    onlineFriends,
    setOnlineFriends,
    selectedUser,
    setSelectedUser,
    conversations,
    setConversations,
  } = useChatContext();

  const { status } = useSession();

  useEffect(() => {
    // get friends and conversations
    const fetchFriendsAndConversation = async () => {
      const friendsData = axiosAuth.get<FriendProps[]>(`/friends`);
      const conversationsData =
        axiosAuth.get<ConversationProps[]>(`/conversation`);

      const [friendsRes, conversationsRes] = await Promise.all([
        friendsData,
        conversationsData,
      ]);

      setConversations?.(conversationsRes?.data);
      setFriendList?.(friendsRes?.data);
    };

    status == "authenticated" && fetchFriendsAndConversation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosAuth, status]);

  useEffect(() => {
    const onUserOnline = (data: { userId: string; status: string }) => {
      if (
        data.status == Status.Online &&
        !onlineFriends?.includes(data.userId)
      ) {
        setOnlineFriends?.((prev) => [...prev, data.userId]);
      }
    };
    const onUserOffline = (data: { userId: string; status: string }) => {
      if (data.status == Status.Offline) {
        setOnlineFriends?.((prev) =>
          prev.filter((friendId) => friendId !== data.userId)
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
    <>
      <div className="flex h-full flex-col gap-4 border-r-[1px] px-4 py-6">
        <div className="my-2 flex flex-col gap-4 border-b-[1px]">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold">Messages</p>
            <div className="flex items-center">
              <button className="delay-50 flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-gray-100">
                <BsPencilSquare className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <BsSearch className="absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-500" />
          </div>
          <div className="">
            <div className="flex flex-col">
              <p className="text-sm">Online now</p>
              {fakeOnlineFriends?.length ? (
                <div className="flex gap-4 overflow-x-auto scrollbar-none">
                  {fakeOnlineFriends?.map((friendId) => {
                    const friend = fakeFriendList?.find(
                      (friend) => friend.id === friendId
                    );
                    return (
                      <div
                        key={friendId}
                        className="flex items-center gap-2 py-2"
                      >
                        <Avatar image={friend?.avatar_url} isOnline={true} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No friends online</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <ConversationList />
        </div>
      </div>
    </>
  );
};

export default MessageSection;
