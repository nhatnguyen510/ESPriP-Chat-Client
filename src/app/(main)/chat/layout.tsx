"use client";

import { ChatProvider } from "@/../context/ChatProvider";
import { SessionExpiredModal } from "../../components/Modal/SessionExpiredModal";
import { useSessionExpiredModalStore } from "@/../lib/zustand/store";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function ChatLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useSessionExpiredModalStore();
  const router = useRouter();

  return (
    <ChatProvider>
      <SessionExpiredModal
        isOpen={isOpen}
        handleClose={async () => {
          const signOutResponse = await signOut({
            redirect: false,
            callbackUrl: "/login",
          });

          router.push(signOutResponse?.url);
          close();
        }}
      />
      {children}
    </ChatProvider>
  );
}

export default ChatLayout;
