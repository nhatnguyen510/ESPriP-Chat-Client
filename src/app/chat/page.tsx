import React from "react";
import SideBar from "../components/SideBar";
import ChatSection from "../components/ChatSection";
import { getCurrentUser } from "@/../lib/session";
import MessageSection from "../components/MessageSection";

export interface chatProps {}

export default async function Chat(props: chatProps) {
  const user = await getCurrentUser();

  return (
    <>
      <div className="flex h-screen flex-1 flex-col justify-between">
        <div className="flex h-full">
          <SideBar currentUser={user} />
          <div className="w-3/12 lg:ml-32">
            <MessageSection />
          </div>
          <div className="relative flex w-9/12 flex-col">
            <ChatSection />
          </div>
        </div>
      </div>
    </>
  );
}
