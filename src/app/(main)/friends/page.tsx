"use client";

import React from "react";
import {
  Tabs,
  Tab,
  Chip,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { IoIosMore } from "react-icons/io";
import NextImage from "next/image";

interface friendsProps {}

export default function Friends(props: friendsProps) {
  return (
    <>
      <div className="ml-32 h-full flex-1">
        <div className="h-full rounded-md p-4 md:px-12">
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
            />
          </div>
          <div className="flex w-full">
            <Tabs
              aria-label="Options"
              color="primary"
              variant="underlined"
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
                key="all"
                title={
                  <div className="flex flex-1 items-center space-x-2">
                    <span>All</span>
                    <Chip size="sm" variant="faded">
                      9
                    </Chip>
                  </div>
                }
              />
              <Tab
                key="online"
                title={
                  <div className="flex items-center space-x-2">
                    <span>Online</span>
                    <Chip size="sm" variant="faded">
                      3
                    </Chip>
                  </div>
                }
              />
              <Tab
                key="Friend Requests"
                title={
                  <div className="flex items-center space-x-2">
                    <span>Friend Requests</span>
                    <Chip size="sm" variant="faded">
                      1
                    </Chip>
                  </div>
                }
              />
            </Tabs>
          </div>
          <div
            className="
          flex
          h-full w-full
          flex-col
          overflow-y-auto
          rounded-tl-2xl
          rounded-tr-2xl
          bg-[#fcfeff]
          p-4
          scrollbar-hide
        "
          >
            <div className="grid grid-cols-2 gap-4 py-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card
                    key={i}
                    shadow="md"
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
                            Jane Cooper
                          </p>
                          <p className="truncate text-sm text-gray-500 dark:text-white/60">
                            Software Engineer
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
                          <DropdownMenu>
                            <DropdownItem>View Profile</DropdownItem>
                            <DropdownItem>Remove Friend</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </CardBody>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
