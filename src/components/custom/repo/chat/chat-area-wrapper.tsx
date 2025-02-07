import { mastra } from "@/mastra";
import { ChatArea } from "./chat-area";
import { cookies } from "next/headers";

interface ChatAreaWrapperProps {
  repoId: number;
}

export const ChatAreaWrapper: React.FC<ChatAreaWrapperProps> = async ({
  repoId,
}) => {
  const cookieStore = await cookies();
  const cookieThreadId = cookieStore.get(`threadId:${repoId}`);

  const initialMessages = cookieThreadId
    ? (await mastra.memory?.query({ threadId: cookieThreadId.value }))
        ?.uiMessages
    : undefined;

  return <ChatArea repoId={repoId} initialMessages={initialMessages} />;
};
