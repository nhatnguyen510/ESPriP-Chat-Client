"use client";

import DesktopItem from "./DesktopItem";
import useRoutes from "@/../lib/hooks/useRoutes";
import SettingsModal from "./SettingsModal";
import { useState } from "react";
import { CurrentUserReturnType } from "@/../lib/session";
import { LogoutModal } from "./Modal/LogoutModal";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";
import { useSession } from "next-auth/react";

interface DesktopSidebarProps {}

const DesktopSidebar: React.FC<DesktopSidebarProps> = () => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isModalOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      <SettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <LogoutModal isOpen={isModalOpen} onOpenChange={onOpenChange} />
      <div
        className="
        hidden 
        justify-between 
        lg:fixed 
        lg:inset-y-0 
        lg:left-0 
        lg:z-40 
        lg:flex
        lg:w-32 
        lg:flex-col 
        lg:border-r-[1px]
        lg:bg-white
        lg:pb-4
      "
      >
        <nav className="mt-4 flex w-full flex-col justify-between">
          <ul role="list" className="flex flex-col items-start space-y-1">
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
              />
            ))}
          </ul>
        </nav>
        <div className="flex justify-center px-2 pt-2">
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <Avatar
                isBordered
                src={user?.avatar_url as string}
                className="cursor-pointer"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-bold">@{user?.username}</p>
              </DropdownItem>
              <DropdownItem key="user-profile" href="/profile">
                My Profile
              </DropdownItem>

              <DropdownItem key="logout" color="danger" onPress={onOpen}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default DesktopSidebar;
