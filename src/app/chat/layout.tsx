import { ChatProvider } from "@/../context/ChatProvider";

function ChatLayout({ children }: { children: React.ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>;
}

export default ChatLayout;
