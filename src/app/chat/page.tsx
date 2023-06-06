import React from "react";
import SideBar from "../components/SideBar";
import ChatSection from "../components/ChatSection";
import { getCurrentUser } from "../../../lib/session";

export interface chatProps {}

export default async function Chat(props: chatProps) {
  const user = await getCurrentUser();

  return (
    <>
      <div className="flex h-screen flex-1 flex-col justify-between p-2 sm:p-6">
        <div className="flex h-full">
          <div className="w-3/12">
            <SideBar user={user} />
          </div>
          <div className="flex w-9/12 flex-col">
            <ChatSection user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
