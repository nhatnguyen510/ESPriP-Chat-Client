"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  ScrollShadow,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Image,
  User,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import { IoPersonAdd, IoCheckmarkCircleOutline } from "react-icons/io5";
import { HiSearch } from "react-icons/hi";
import useAxiosAuth from "@/../lib/hooks/useAxiosAuth";
import { debounce } from "lodash";
import { useChatContext } from "../../../../context/ChatProvider";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface searchResultProps {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

export const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isOpen,
  onClose,
}) => {
  const axiosAuth = useAxiosAuth();
  const { sentFriendRequests, setSentFriendRequests } = useChatContext();
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<searchResultProps[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [sendingRequests, setSendingRequests] = useState<
    Record<string, boolean>
  >({});

  console.log("sentFriendRequests", sentFriendRequests);

  const isSentRequest = (userId: string) => {
    return sentFriendRequests?.some((friend) => friend.id === userId);
  };

  const sendFriendRequest = async (userId: string) => {
    if (isSentRequest(userId)) {
      return;
    }

    try {
      setSendingRequests((prev) => ({ ...prev, [userId]: true }));
      const { data } = await axiosAuth.post(`/friends/requests/send`, {
        accepted_user_id: userId,
        requested_user_public_key: "thisismypublickey",
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSendingRequests((prev) => ({ ...prev, [userId]: false }));

      if (data) {
        setSentFriendRequests?.((prev) => [...prev, data.accepted_user]);
      }

      console.log(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        setSendingRequests((prev) => ({ ...prev, [userId]: false }));
      }
    }
  };

  useEffect(() => {
    // TODO: fetch users from backend
    const fetchUsers = async () => {
      setIsSearching(true);

      const { data } = await axiosAuth.get(`/user/search?query=${searchInput}`);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSearchResults(data);

      setIsSearching(false);
    };

    // use throttle to prevent too many requests
    const debouncedFetchUsers = debounce(fetchUsers, 300);

    if (searchInput) {
      debouncedFetchUsers();
    }

    return () => {
      debouncedFetchUsers.cancel();

      setSearchResults([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <>
      <Modal size="xl" backdrop="opaque" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4 className="text-2xl font-semibold text-black/90 dark:text-white/90">
                  Add Friend
                </h4>
              </ModalHeader>
              <ModalBody>
                <Input
                  isClearable
                  label="Search"
                  variant="bordered"
                  value={searchInput}
                  onValueChange={setSearchInput}
                  placeholder="Type to search..."
                  startContent={
                    <HiSearch className="pointer-events-none mb-0.5 flex-shrink-0 text-black/50 text-slate-400 dark:text-white/90" />
                  }
                />

                <ScrollShadow hideScrollBar className="max-h-[400px]">
                  {isSearching ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <p className="text-sm text-gray-400">Searching...</p>
                    </div>
                  ) : searchResults?.length ? (
                    searchResults.map((user) => (
                      <Popover key={user.id} showArrow placement="right-end">
                        <div className="mt-4 flex items-center justify-between">
                          <PopoverTrigger>
                            <User
                              as="button"
                              name={`${user.first_name} ${user.last_name}`}
                              description={user.username}
                              className="transition-transform"
                              avatarProps={{
                                src: user.avatar || "/avatar-cute-2.jpeg",
                              }}
                            />
                          </PopoverTrigger>
                          <Button
                            isLoading={sendingRequests[user.id]}
                            color={
                              isSentRequest(user.id) ? "default" : "primary"
                            }
                            size="sm"
                            endContent={
                              isSentRequest(user.id) ? (
                                <IoCheckmarkCircleOutline className="text-xl" />
                              ) : !sendingRequests[user.id] ? (
                                <IoPersonAdd className="text-xl text-white/90" />
                              ) : null
                            }
                            onPress={() => sendFriendRequest(user.id)}
                          >
                            {isSentRequest(user.id)
                              ? "Request Sent"
                              : sendingRequests[user.id]
                              ? "Sending..."
                              : "Add Friend"}
                          </Button>
                        </div>

                        <PopoverContent className="p-1">
                          <Card
                            shadow="none"
                            className="max-w-[300px] border-none bg-transparent"
                          >
                            <CardHeader className="justify-between">
                              <div className="flex gap-3">
                                <Avatar
                                  isBordered
                                  radius="full"
                                  size="md"
                                  src={user.avatar || "/avatar-cute-2.jpeg"}
                                />
                                <div className="flex flex-col items-start justify-center">
                                  <h4 className="text-small font-semibold leading-none text-default-600">
                                    {user.first_name} {user.last_name}
                                  </h4>
                                  <h5 className="text-small tracking-tight text-default-500">
                                    {user.username}
                                  </h5>
                                </div>
                              </div>
                              <Button
                                className={
                                  true
                                    ? "border-default-200 bg-transparent text-foreground"
                                    : ""
                                }
                                color="primary"
                                radius="full"
                                size="sm"
                                variant={true ? "bordered" : "solid"}
                              >
                                {true ? "Unfollow" : "Follow"}
                              </Button>
                            </CardHeader>
                            <CardBody className="px-3 py-0">
                              <p className="pl-px text-small text-default-500">
                                Lorem ipsum dolor sit amet consectetur
                                <span aria-label="confetti" role="img">
                                  🎉
                                </span>
                              </p>
                            </CardBody>
                            <CardFooter className="gap-3">
                              <div className="flex gap-1">
                                <p className="text-small font-semibold text-default-600">
                                  4
                                </p>
                                <p className=" text-small text-default-500">
                                  Mutual Friends
                                </p>
                              </div>
                            </CardFooter>
                          </Card>
                        </PopoverContent>
                      </Popover>
                    ))
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                      <p className="mt-4 text-lg text-gray-400">
                        No results found
                      </p>
                    </div>
                  )}
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
