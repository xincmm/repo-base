"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { type Message, useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageViewer } from "./message";

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
    initialMessages: initialMessages,
  });

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messagesHeight, setMessagesHeight] = useState("auto");

  useEffect(() => {
    const container = containerRef.current;
    const textarea = textareaRef.current;

    if (!container || !textarea) return;

    const calculateHeights = () => {
      const containerRect = container.getBoundingClientRect();
      const textareaRect = textarea.getBoundingClientRect();
      const availableHeight = containerRect.height - (textareaRect.height + 48);
      setMessagesHeight(`${availableHeight}px`);
    };

    const observer = new ResizeObserver(calculateHeights);
    observer.observe(container);
    observer.observe(textarea);

    calculateHeights();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main
      ref={containerRef}
      className="bg-background rounded-xl h-[calc(100vh-32px-16px)] overflow-hidden p-4 border space-y-2 flex flex-col gap-2"
    >
      <ScrollArea style={{ height: messagesHeight }} className="pr-3">
        <div className="space-y-2">
          {messages.map((m) => (
            <MessageViewer key={m.id} message={m} />
          ))}
          <div className="mt-8" ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <form className="relative" action={() => handleSubmit()}>
        <Textarea
          autoFocus
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleEnter}
          placeholder="Write something"
          className="bg-sidebar border focus-visible:ring-ring/30 pr-8 shadow-lg max-h-80"
        />
        <Button size="xs" className="absolute bottom-2 right-2" type="submit">
          <SendHorizontal className="-rotate-90 size-4" />
        </Button>
      </form>
    </main>
  );
};
