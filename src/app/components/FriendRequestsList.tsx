"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  ScrollShadow,
  User,
  Button,
  ButtonGroup,
} from "@nextui-org/react";
import { useChatContext } from "@/../context/ChatProvider";
import { ConversationProps, FriendProps, FriendRequestProps } from "@/../types";
import { useRouter } from "next/navigation";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import { HiCheck, HiOutlineX } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

interface FriendRequestsListProps {}

export const FriendRequestsList: React.FC<FriendRequestsListProps> = () => {
  const {
    setFriendList,
    friendRequestsList,
    setFriendRequestsList,
    setConversations,
  } = useChatContext();
  const router = useRouter();

  const axiosAuth = useAxiosAuth();

  const handleOnAccept = async (friend: FriendProps) => {
    const { data } = await axiosAuth.post<{
      message: string;
      conversation: ConversationProps;
    }>(`/friends/requests/accept`, {
      requested_user_id: friend.id,
      accepted_user_public_key: "hereismypublickey",
    });

    setFriendRequestsList?.((prev) =>
      prev.filter((req) => req.requested_user.id !== friend.id)
    );

    setFriendList?.((prev) => [...prev, friend]);

    setConversations?.((prev) => [...prev, data.conversation]);

    toast.success(`You are now friends with ${friend.username}`);
  };

  const handleOnReject = async (friend: FriendProps) => {
    try {
      await axiosAuth.post(`/friends/requests/reject`, {
        requested_user_id: friend.id,
      });

      setFriendRequestsList?.((prev) =>
        prev.filter((req) => req.requested_user.id !== friend.id)
      );

      toast(`You have rejected ${friend.username}'s friend request`);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log("error inside", err);
        toast.error(err.response?.data.message);
      }
    }
  };

  return (
    <>
      <ScrollShadow hideScrollBar className="max-h-[650px]">
        {friendRequestsList?.length ? (
          friendRequestsList.map(({ requested_user: friend }, i) => (
            <div key={friend?.id} className="px-2 py-4">
              <Card fullWidth shadow="sm">
                <CardBody>
                  <div className="flex items-center justify-between gap-2">
                    <User
                      name={`${friend.first_name} ${friend.last_name}`}
                      description={friend.username}
                      avatarProps={{
                        src: friend.avatar_url || "/avatar-cute-2.jpeg",
                      }}
                    />
                    <ButtonGroup>
                      <Button
                        size="sm"
                        color="primary"
                        endContent={<HiCheck className="text-xl" />}
                        onClick={() => handleOnAccept(friend)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="bordered"
                        endContent={<HiOutlineX className="text-xl" />}
                        onClick={() => handleOnReject(friend)}
                      >
                        Decline
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))
        ) : (
          <div className="flex items-center">
            <span className="text-sm text-gray-500">No friend requests</span>
          </div>
        )}
      </ScrollShadow>
    </>
  );
};
