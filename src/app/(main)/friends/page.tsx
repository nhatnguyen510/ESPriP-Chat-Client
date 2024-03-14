"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Tabs,
  Tab,
  Chip,
  Input,
  Button,
  Tooltip,
  useDisclosure,
  Card,
  CardBody,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import NextImage from "next/image";
import { FriendList } from "@/app/components/FriendList";
import { IoPersonAdd, IoNotifications } from "react-icons/io5";
import { AddFriendModal } from "@/app/components/Modal/AddFriendModal";
import { OnlineFriendList } from "@/app/components/OnlineFriendList";
import { FriendRequestsList } from "@/app/components/FriendRequestsList";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import { debounce } from "lodash";
import { FriendProps } from "@/../types";
import { useChatContext } from "@/../context/ChatProvider";
import { useSession } from "next-auth/react";

export default function Friends() {
  const axiosAuth = useAxiosAuth();
  const { friendList, onlineFriends, friendRequestsList } = useChatContext();
  const [selectedTab, setSelectedTab] = useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<FriendProps[]>([]);
  const { data } = useSession();
  const user = data?.user;

  const numberOfFriends = useMemo(() => {
    if (friendList) {
      return friendList.length;
    }
  }, [friendList]);

  const numberOfOnlineFriends = useMemo(() => {
    if (onlineFriends) {
      console.log("onlineFriends", onlineFriends);
      return onlineFriends.length;
    }
  }, [onlineFriends]);

  const numberOfFriendRequests = useMemo(() => {
    if (friendRequestsList) {
      return friendRequestsList.length;
    }
  }, [friendRequestsList]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!friendList || !searchInput) {
        return;
      }

      const { data } = await axiosAuth.get<FriendProps[]>(
        `/friends/search?query=${searchInput}`
      );

      console.log("data", data);

      setSearchResults(data);
    };

    const debouncedSearch = debounce(fetchSearchResults, 500);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  console.log("User in Friend Page: ", user);

  return (
    <>
      <div className="h-full rounded-md p-4 md:px-6">
        <div className="flex items-center justify-between">
          <h3
            className="
              text-2xl
              font-semibold
              text-black/90
              dark:text-white/90
            "
          >
            Friends
          </h3>

          <div className="flex items-center gap-4">
            <Tooltip
              content="Add Friend"
              placement="top-end"
              delay={0}
              closeDelay={0}
              motionProps={{
                variants: {
                  exit: {
                    opacity: 0,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn",
                    },
                  },
                  enter: {
                    opacity: 1,
                    transition: {
                      duration: 0.15,
                      ease: "easeOut",
                    },
                  },
                },
              }}
            >
              <Button variant="ghost" isIconOnly onPress={onOpen}>
                <IoPersonAdd className="text-2xl text-black/50 dark:text-white/90" />
              </Button>
            </Tooltip>

            <AddFriendModal isOpen={isOpen} onClose={onClose} />
          </div>
        </div>

        <Tabs
          aria-label="Options"
          color="primary"
          variant="underlined"
          selectedKey={selectedTab}
          onSelectionChange={(key) => {
            setSelectedTab(key as any);
          }}
          classNames={{
            base: "flex w-full",
            tabList:
              "flex w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#22d3ee]",
            tab: "px-0 h-12",
            tabContent: "group-data-[selected=true]:text-[#06b6d4]",
          }}
        >
          <Tab
            key="all-friends"
            title={
              <div className="flex flex-1 items-center space-x-2">
                <span>All</span>
                <Chip radius="sm" size="md" variant="faded">
                  {numberOfFriends}
                </Chip>
              </div>
            }
          >
            <Card>
              <CardBody className="gap-4">
                <div className="flex items-center justify-end">
                  <Input
                    label="Search"
                    size="sm"
                    isClearable
                    radius="lg"
                    classNames={{
                      base: "max-w-xs",
                      label: "text-black/50 dark:text-white/90",
                      input: [
                        "bg-transparent",
                        "text-black/90 dark:text-white/90",
                        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                      ],
                      innerWrapper: "bg-transparent",
                      inputWrapper: [
                        "shadow-xl",
                        "bg-default-200/50",
                        "dark:bg-default/60",
                        "backdrop-blur-xl",
                        "backdrop-saturate-200",
                        "hover:bg-default-200/70",
                        "dark:hover:bg-default/70",
                        "group-data-[focused=true]:bg-default-200/50",
                        "dark:group-data-[focused=true]:bg-default/60",
                        "!cursor-text",
                      ],
                    }}
                    placeholder="Type to search..."
                    startContent={
                      <HiSearch className="pointer-events-none mb-0.5 flex-shrink-0 text-black/50 text-slate-400 dark:text-white/90" />
                    }
                    value={searchInput}
                    onValueChange={setSearchInput}
                    onClear={() => setSearchResults([])}
                  />
                </div>
                <FriendList
                  searchedFriends={searchResults}
                  searchInput={searchInput}
                />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="online"
            title={
              <div className="flex items-center space-x-2">
                <span>Online</span>
                <Chip radius="sm" size="md" variant="faded">
                  {numberOfOnlineFriends}
                </Chip>
              </div>
            }
          >
            <Card>
              <CardBody>
                <OnlineFriendList />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="friend-requests"
            title={
              <div className="flex items-center space-x-2">
                <span>Friend Requests</span>
                <Chip radius="sm" size="md" variant="faded">
                  {numberOfFriendRequests}
                </Chip>
              </div>
            }
          >
            <Card>
              <CardBody>
                <FriendRequestsList />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
