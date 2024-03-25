"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, ScrollShadow, User } from "@nextui-org/react";
import { useChatContext } from "@/../context/ChatProvider";
import { FriendProps } from "@/../types";
import Avatar from "./Avatar";
import { useRouter } from "next/navigation";

interface OnlineFriendListProps {}

export const OnlineFriendList: React.FC<OnlineFriendListProps> = () => {
  const {
    onlineFriends,
    friendList,
    selectedUser,
    setSelectedUser,
    conversations,
    setCurrentChat,
  } = useChatContext();
  const router = useRouter();

  const [onlineFriendsList, setOnlineFriendsList] = useState<
    FriendProps[] | undefined
  >([]);

  useEffect(() => {
    const online = friendList?.filter((friend) =>
      onlineFriends?.includes(friend.id)
    );
    setOnlineFriendsList(online);
  }, [friendList, onlineFriends]);

  useEffect(() => {
    const conversation = conversations?.find((conversation) =>
      conversation.participants_ids.includes(selectedUser?.id as string)
    );

    if (conversation) {
      setCurrentChat?.(conversation);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, selectedUser]);

  return (
    <>
      <ScrollShadow hideScrollBar className="max-h-[650px]">
        {onlineFriendsList?.length ? (
          onlineFriendsList.map((friend, i) => (
            <div key={friend?.id} className="px-2 py-4">
              <Card
                isPressable
                fullWidth
                shadow="sm"
                onPress={() => {
                  setSelectedUser?.(friend as any);
                  router.push("/chat");
                }}
              >
                <CardBody>
                  <div className="flex items-center justify-center gap-2">
                    <Avatar image={friend?.avatar_url} isOnline />
                    <div className="flex-1">
                      <h4 className="text-black/90 dark:text-white/90">
                        {friend?.first_name} {friend?.last_name}
                      </h4>
                      <span className="text-sm text-black/50 dark:text-white/50">
                        {friend?.username}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))
        ) : (
          <div className="flex items-center">
            <span className="text-sm text-gray-500">No friends online</span>
          </div>
        )}
      </ScrollShadow>
    </>
  );
};
