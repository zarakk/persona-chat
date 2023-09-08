import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ChatClient from "./components/client";

interface ChatIDProps {
  params: {
    chatId: string;
  };
}

const ChatID = async ({ params }: ChatIDProps) => {
  const { userId } = auth();
  if (!userId) return redirectToSignIn();

  const persona = await prismadb.persona.findUnique({
    where: {
      id: params.chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  if (!persona) return redirect("/");
  return <ChatClient persona={persona} />;
};

export default ChatID;
