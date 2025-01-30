// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mastra } from "@/mastra";
import { ChatArea } from "./chat-area";

interface ChatAreaWrapperProps {
  repoId: number;
}

export const ChatAreaWrapper: React.FC<ChatAreaWrapperProps> = async ({
  repoId,
}) => {
  return <ChatArea repoId={repoId} initialMessages={undefined} />;
};
