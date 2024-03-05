import React, { useState } from "react";
import { useChatContext } from "@/../context/ChatProvider";
import { ConversationProps } from "@/../types";
import { Avatar } from "@nextui-org/react";

interface ConversationSearchResultProps {
  searchedConversations: ConversationProps[];
}

export const ConversationSearchResult: React.FC<
  ConversationSearchResultProps
> = ({ searchedConversations }) => {
  const { friendList, setSelectedUser, setCurrentChat } = useChatContext();
  const [isSearching, setIsSearching] = useState<boolean>(false);

  return (
    <div className={`flex min-h-0 flex-1 flex-col space-y-2 overflow-y-auto`}>
      {isSearching ? (
        <div
          role="status"
          className="max-w-md flex-1 animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      ) : searchedConversations?.length ? (
        searchedConversations?.map((conversation) => {
          const friend = friendList?.find(
            (friend) =>
              conversation?.participants_ids?.includes(friend?.id) || ""
          );

          return (
            <div
              key={conversation?.id}
              className={`delay-50 duration flex cursor-pointer items-center gap-2 rounded-md p-2 ease-in-out transition hover:bg-gray-100 `}
              onClick={() => {
                setSelectedUser?.(friend as any);
                setCurrentChat?.(conversation);
              }}
            >
              <Avatar src={friend?.avatar_url} />
              <div className="flex h-full w-full flex-col justify-between">
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-sm font-semibold">{`${friend?.first_name} ${friend?.last_name}`}</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-gray-500">
          No conversations found, start a new chat
        </p>
      )}
    </div>
  );
};
