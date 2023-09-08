"use client";
"use client";
import ChatHeader from "@/components/chat-header";
import { Message, Persona } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCompletion } from "ai/react";
import ChatForm from "@/components/ChatForm";
import ChatMessages from "@/components/ChatMessages";
import { ChatMessageProps } from "@/components/ChatMessage";
interface ChatClientProps {
  persona: Persona & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

const ChatClient = ({ persona }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    persona.messages
  );

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${persona.id}`,
      onFinish(prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };
        setMessages((current) => [...current, systemMessage]);
        setInput("");

        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };
    setMessages((current) => [...current, userMessage]);

    handleSubmit(e);
  };
  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader persona={persona} />
      <ChatMessages
        persona={persona}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};
export default ChatClient;
