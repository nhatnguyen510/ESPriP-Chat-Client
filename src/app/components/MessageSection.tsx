"use client";

import React, { useEffect, useState } from "react";
import Avatar from "@/app/components/Avatar";
import { ConversationProps, FriendProps } from "@/../types";
import ConversationList from "./ConversationList";
import { useSessionKeysStore } from "@/../lib/zustand/store";
import { useChatContext } from "@/../context/ChatProvider";
import { ConversationSearchResult } from "./ConversationSearchResult";
import { Input } from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";

interface MessageSectionProps {}

const MessageSection: React.FC<MessageSectionProps> = () => {
  const { sessionKeys } = useSessionKeysStore();
  const { onlineFriends, friendList, conversations } = useChatContext();
  const [searchedConversations, setSearchedConversations] = useState<
    ConversationProps[]
  >([]);
  const [searchInput, setSearchInput] = useState<string>("");

  const handleSearchConversation = (input: string) => {
    // Search conversation
    const searched = conversations?.filter((conversation) => {
      const friend = friendList?.find((friend) =>
        conversation?.participants_ids?.includes(friend?.id)
      );

      return (
        friend?.username?.toLowerCase().includes(input.toLowerCase()) ||
        friend?.first_name?.toLowerCase().includes(input.toLowerCase()) ||
        friend?.last_name?.toLowerCase().includes(input.toLowerCase())
      );
    });

    setSearchedConversations(searched || []);
  };

  useEffect(() => {
    if (searchInput) {
      handleSearchConversation(searchInput);
    } else {
      setSearchedConversations([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <>
      <div className="flex h-full flex-col gap-4 border-r-[1px] px-4 py-6">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold">Messages</p>
        </div>
        <Input
          label="Search"
          size="sm"
          isClearable
          radius="lg"
          placeholder="Type to search..."
          startContent={
            <HiSearch className="pointer-events-none mb-0.5 flex-shrink-0 text-black/50 text-slate-400 dark:text-white/90" />
          }
          value={searchInput}
          onValueChange={setSearchInput}
          onClear={() => setSearchedConversations([])}
        />

        {searchInput ? (
          searchedConversations?.length ? (
            <ConversationSearchResult
              searchedConversations={searchedConversations}
            />
          ) : (
            <p className="text-sm text-gray-500">No results found</p>
          )
        ) : (
          <div className="flex flex-col">
            <p className="text-sm">Online now</p>
            {onlineFriends?.length ? (
              <div className="flex gap-4 overflow-x-auto scrollbar-none">
                {onlineFriends?.map((friendId) => {
                  const friend = friendList?.find(
                    (friend) => friend?.id === friendId
                  );

                  return (
                    <div
                      key={friend?.id}
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

            <ConversationList />
          </div>
        )}
      </div>
    </>
  );
};

export default MessageSection;
