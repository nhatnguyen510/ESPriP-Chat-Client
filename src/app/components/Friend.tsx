import React from "react";
import NextImage from "next/image";
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
import { FriendProps } from "@/../types";
import { IoIosMore } from "react-icons/io";

interface FriendCardProps {
  friend: FriendProps;
  onHandleAction: (key: any, friend: FriendProps) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onHandleAction,
}) => {
  return (
    <Card
      key={friend.id}
      shadow="sm"
      className="w-full rounded-tl-2xl rounded-tr-2xl bg-[#fcfeff]"
    >
      <CardBody className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <Image
              as={NextImage}
              className="rounded-full"
              alt=""
              width={80}
              height={80}
              src="/avatar-cute-2.jpeg"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white/90">
              {friend.username}
            </p>
            <p className="truncate text-sm text-gray-500 dark:text-white/60">
              {friend.username}
            </p>
          </div>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                size="sm"
                variant="light"
                className="rounded-full shadow-none"
                isIconOnly
              >
                <IoIosMore className="text-xl" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dropdown menu"
              onAction={(key) => onHandleAction(key, friend)}
            >
              <DropdownItem key="view-profile">View Profile</DropdownItem>
              <DropdownItem key="remove-friend">Remove Friend</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardBody>
    </Card>
  );
};
