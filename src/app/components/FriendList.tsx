"use client";

import {
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  Image,
  Button,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@nextui-org/react";
import NextImage from "next/image";
import React from "react";
import { IoIosMore } from "react-icons/io";
import { useChatContext } from "@/../context/ChatProvider";
import { RemoveFriendModal } from "./Modal/RemoveFriendModal";
import { FriendProps } from "@/../types";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { FriendCard } from "./Friend";

interface FriendListProps {
  searchedFriends?: FriendProps[];
  searchInput?: string;
}

export const FriendList: React.FC<FriendListProps> = ({
  searchedFriends,
  searchInput,
}) => {
  const axiosAuth = useAxiosAuth();
  const { friendList, setFriendList, setConversations } = useChatContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFriend, setSelectedFriend] =
    React.useState<FriendProps | null>(null);

  console.log("selectedFriend", selectedFriend);

  const onHandleAction = (key: any, friend: FriendProps) => {
    setSelectedFriend(friend);
    if (key === "view-profile") {
      console.log("view profile");
    } else if (key === "remove-friend") {
      onOpen();
    }
  };

  const handleRemoveFriend = async () => {
    console.log("remove friend", selectedFriend);

    try {
      const { data } = await axiosAuth.post<{
        message: string;
        conversation_id: string;
      }>("/friends/remove", {
        friend_id: selectedFriend?.id,
      });

      toast.success(
        `You are no longer friends with ${selectedFriend?.username}`
      );

      setFriendList?.((prev) =>
        prev.filter((friend) => friend.id !== selectedFriend?.id)
      );

      setConversations?.((prev) =>
        prev.filter((conversation) => conversation.id !== data.conversation_id)
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log("error while removing friend", err);

        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {searchInput ? (
          searchedFriends?.length ? (
            searchedFriends.map((friend, i) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onHandleAction={onHandleAction}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">No search results</p>
          )
        ) : friendList?.length ? (
          friendList.map((friend, i) => (
            <FriendCard
              key={friend?.id}
              friend={friend}
              onHandleAction={onHandleAction}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No friends</p>
        )}

        <RemoveFriendModal
          username={selectedFriend?.username as string}
          isOpen={isOpen}
          onClose={onClose}
          handleRemoveFriend={handleRemoveFriend}
        />
      </div>
    </>
  );
};
