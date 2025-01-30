"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { type Message, useChat } from "ai/react";

interface ChatAreaProps {
  repoId: number;
  initialMessages: Message[] | undefined;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  initialMessages,
  repoId,
}) => {
  const { messages, handleSubmit, input, handleInputChange } = useChat({
    id: String(repoId),
    api: `/api/chat?repoId=${repoId}`,
    initialMessages,
  });

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="grow bg-sidebar h-screen overflow-hidden py-2 space-y-2 flex flex-col">
      <div id="top-part" className="h-7 flex items-center"></div>
      <div className="w-full bg-background rounded-xl grow p-6 border flex flex-col">
        <div className="grow">
          <p>Messages</p>
          {messages.map((m) => (
            <div key={m.id}>{m.content}</div>
          ))}
        </div>

        <form className="relative" action={() => handleSubmit()}>
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleEnter}
            placeholder="Write something"
            className="bg-sidebar border focus-visible:ring-ring/30 pr-8 shadow-lg"
          />
          <Button size="xs" className="absolute bottom-2 right-2" type="submit">
            <SendHorizontal className="-rotate-90 size-4" />
          </Button>
        </form>
      </div>
    </main>
  );
};
