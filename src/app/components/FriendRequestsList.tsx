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
import { useSessionKeysStore } from "@/../lib/zustand/store";
import { useSession } from "next-auth/react";
import {
  encryptSessionKey,
  decryptSessionKey,
  deriveSessionKey,
} from "@/../lib/encryption";
import { DiffieHellman } from "crypto";

interface FriendRequestsListProps {}

export const FriendRequestsList: React.FC<FriendRequestsListProps> = () => {
  const {
    setFriendList,
    friendRequestsList,
    setFriendRequestsList,
    setConversations,
    keys,
  } = useChatContext();

  const { data: session } = useSession();

  const { sessionKeys, setSessionKeys } = useSessionKeysStore();

  const router = useRouter();

  const axiosAuth = useAxiosAuth();

  const handleOnAccept = async (
    friend: FriendProps,
    friendPublicKey: string
  ) => {
    const { data: requestAcceptData } = await axiosAuth.post<{
      message: string;
      conversation: ConversationProps;
    }>(`/friends/requests/accept`, {
      requested_user_id: friend.id,
      accepted_user_public_key: keys?.current?.getPublicKey("hex"),
    });

    setFriendRequestsList?.((prev) =>
      prev.filter((req) => req.requested_user.id !== friend.id)
    );

    setFriendList?.((prev) => [
      ...prev,
      {
        ...friend,
        friend_public_key: friendPublicKey,
      },
    ]);

    setConversations?.((prev) => [...prev, requestAcceptData.conversation]);

    const sessionKey = deriveSessionKey(
      keys?.current as DiffieHellman,
      friendPublicKey
    );

    const masterKey = session?.user?.master_key;

    // Encrypt the session key by master key, save it to the database
    const encryptedSessionKey = encryptSessionKey(
      sessionKey,
      Buffer.from(masterKey as string, "hex")
    );

    console.log("sessionKey on accept", sessionKey);

    const { data: encryptionData } = await axiosAuth.post(
      "/encryption/session-key",
      {
        encrypted_key: encryptedSessionKey.encryptedData,
        conversation_id: requestAcceptData.conversation.id,
        iv: encryptedSessionKey.iv,
      }
    );

    console.log("encryptionData: ", encryptionData);

    setSessionKeys?.((prev) => ({
      ...(prev as any),
      [requestAcceptData.conversation.id]: sessionKey,
    }));

    // TODO: encrypt the session key by master key, save it to the database
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
          friendRequestsList.map(
            ({ requested_user: friend, requested_user_public_key }, i) => (
              <div key={friend?.id} className="px-2 py-4">
                <Card fullWidth shadow="sm">
                  <CardBody>
                    <div className="flex items-center justify-between gap-2">
                      <User
                        name={`${friend.first_name} ${friend.last_name}`}
                        description={friend.username}
                        avatarProps={{
                          src: friend.avatar_url || "/no-avatar.png",
                        }}
                      />
                      <ButtonGroup>
                        <Button
                          size="sm"
                          color="primary"
                          endContent={<HiCheck className="text-xl" />}
                          onClick={() =>
                            handleOnAccept(friend, requested_user_public_key)
                          }
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
            )
          )
        ) : (
          <div className="flex items-center">
            <span className="text-sm text-gray-500">No friend requests</span>
          </div>
        )}
      </ScrollShadow>
    </>
  );
};
