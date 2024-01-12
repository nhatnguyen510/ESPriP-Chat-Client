import React from "react";
import SideBar from "../../components/SideBar";
import ChatSection from "../../components/ChatSection";
import { getCurrentUser } from "@/../lib/session";
import MessageSection from "../../components/MessageSection";

export interface chatProps {}

export default async function Chat(props: chatProps) {
  const user = await getCurrentUser();

  return (
    <>
      <div className="flex h-screen">
        <div className="w-1/3 lg:w-3/12">
          <MessageSection />
        </div>
        <div className="relative flex w-2/3 flex-col lg:w-9/12">
          <ChatSection />
        </div>
      </div>
    </>
  );
}
