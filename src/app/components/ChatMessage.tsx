import React from "react";

type chatMessageProps = {
  message: string;
  isSentByUser?: boolean;
  isLastMessage?: boolean;
  isSeen?: boolean;
};

const ChatMessage: React.FC<chatMessageProps> = ({
  message,
  isSentByUser,
  isLastMessage,
  isSeen,
}) => {
  const imageUrl = isSentByUser
    ? "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
    : "https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144";
  const orderClass = isSentByUser ? "order-1" : "order-2";
  const roundedClass = isSentByUser ? "rounded-br-none" : "rounded-bl-none";

  return (
    <div className="chat-message">
      <div className={`flex items-end ${isSentByUser ? "justify-end" : ""}`}>
        <div
          className={`mx-2 flex max-w-xs flex-col items-${
            isSentByUser ? "end" : "start"
          } space-y-2 text-xs ${orderClass}`}
        >
          <span
            className={`inline-block break-words rounded-lg ${
              isSentByUser
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-600"
            } px-4 py-2`}
          >
            {message}
          </span>
          {isSentByUser && isLastMessage && (
            <span className="text-xs text-gray-500">
              {isSeen ? "Seen" : "Sent"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
