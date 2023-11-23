"use client";

import DesktopItem from "./DesktopItem";
import useRoutes from "@/../lib/hooks/useRoutes";
import SettingsModal from "./SettingsModal";
import { useState } from "react";
import Avatar from "./Avatar";
import { CurrentUserReturnType } from "@/../lib/session";

interface DesktopSidebarProps {
  currentUser: CurrentUserReturnType;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
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
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex w-full flex-col items-center justify-between">
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer transition hover:opacity-75"
          >
            <Avatar />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
