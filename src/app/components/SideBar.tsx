"use client";

import DesktopItem from "./DesktopItem";
import useRoutes from "@/../lib/hooks/useRoutes";
import SettingsModal from "./SettingsModal";
import { useState } from "react";
import Avatar from "./Avatar";
import { CurrentUserReturnType } from "@/../lib/session";
import { LogoutModal } from "./Modal/LogoutModal";
import { Button, useDisclosure } from "@nextui-org/react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

interface DesktopSidebarProps {}

const DesktopSidebar: React.FC<DesktopSidebarProps> = () => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isModalOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <SettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <LogoutModal isOpen={isModalOpen} onOpenChange={onOpenChange} />
      <div
        className="
        lg:w-30 
        hidden 
        justify-between 
        lg:fixed 
        lg:inset-y-0 
        lg:left-0 
        lg:z-40
        lg:flex 
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
        <nav className="mx-2 flex w-full items-center justify-center">
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer transition hover:opacity-75"
          >
            <Avatar />
          </div>
          <Button isIconOnly variant="light" onPress={onOpen}>
            <HiArrowLeftOnRectangle className="h-6 w-6" />
          </Button>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
