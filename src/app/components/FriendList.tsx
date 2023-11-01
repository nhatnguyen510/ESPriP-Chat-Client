"use client";

import React, { useEffect, useState } from "react";
import Friend from "./Friend";
import { FriendProps } from "@/../types/types";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import { useChatContext } from "@/../context/ChatProvider";
import socket from "@/../lib/socket";
import { useSession } from "next-auth/react";
import { CurrentUserReturnType } from "@/../lib/session";

type friendListProps = {
  user?: CurrentUserReturnType;
};

const FriendList: React.FC<friendListProps> = ({ user }) => {
  const [friendList, setFriendList] = useState<FriendProps[]>([]);

  const axiosAuth = useAxiosAuth(user);

  const {
    currentChat,
    setCurrentChat,
    onlineFriends,
    setOnlineFriends,
    selectedUser,
    setSelectedUser,
  } = useChatContext();

  useEffect(() => {
    // get friends
    const fetchFriends = async () => {
      const res = await axiosAuth.get(`/user/friends/`);

      setFriendList(res?.data);
    };

    if (!friendList?.length) {
      fetchFriends();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendList?.length]);

  // useEffect(() => {
  //   if (selectedUser?.id) {
  //     //get conversation
  //     const fetchChat = async () => {
  //       try {
  //         const { data } = await axiosAuth.get(
  //           `/chat/conversation/${selectedUser.id}`
  //         );

  //         console.log("fetchChat", { data });
  //         setCurrentChat?.({ ...data });
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };

  //     fetchChat();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedUser?.id]);

  useEffect(() => {
    const onUserOnline = (data: { userId: string; status: string }) => {
      console.log("onUserOnline", { data });
      if (data.status == "Online" && !onlineFriends?.includes(data.userId)) {
        setOnlineFriends?.((prev) => [...prev, data.userId]);
      }
    };
    const onUserOffline = (data: { userId: string; status: string }) => {
      console.log("onUserOffline", { data });
      if (data.status == "Offline") {
        setOnlineFriends?.((prev) =>
          prev.filter((friendId) => friendId !== data.userId)
        );
      }
    };
    const onFriendsOnline = (data: any) => {
      console.log("onFriendsOnline", { data });
      setOnlineFriends?.(data);
    };

    socket.on("userOnline", onUserOnline);

    socket.on("userOffline", onUserOffline);

    socket.on("friendsOnline", onFriendsOnline);

    return () => {
      socket.off("userOnline", onUserOnline);
      socket.off("friendsOnline", onFriendsOnline);
      socket.off("userOffline", onUserOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineFriends]);

  console.log({ onlineFriends });

  return (
    <>
      <div className="w-full flex-1 overflow-y-auto">
        {friendList?.map((friend) => (
          <div
            key={friend.id}
            className="transition-all hover:bg-slate-100"
            onClick={() => setSelectedUser?.(friend)}
          >
            <Friend
              _id={friend.id}
              username={friend.username}
              first_name={friend.first_name}
              last_name={friend.last_name}
              avatarUrl={friend.avatarUrl}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default FriendList;
