"use client";

import { Persona } from "@prisma/client";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { useEffect, useState } from "react";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  persona: Persona;
}
const ChatMessages = ({
  messages = [],
  isLoading,
  persona,
}: ChatMessagesProps) => {
  const [fakeLoading, setFakeLoading] = useState(
    messages.length === 0 ? true : false
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        isLoading={fakeLoading}
        src={persona.src}
        role="system"
        content={`Hello, I am ${persona.name}, ${persona.description}`}
      />
    </div>
  );
};

export default ChatMessages;
