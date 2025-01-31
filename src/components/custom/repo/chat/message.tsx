import { Message } from "ai";
import { MastraAvatar, UserAvatar } from "./avatars";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";

interface MessageViewerProps {
  message: Message;
}

export const MessageViewer: React.FC<MessageViewerProps> = ({ message }) => {
  return (
    <div
      className={cn(
        "rounded-lg p-2 flex gap-2 text-sm",
        message.role === "assistant" && "bg-sidebar shadow",
      )}
    >
      <div>
        {message.role === "assistant" ? (
          <MastraAvatar />
        ) : message.role === "user" ? (
          <UserAvatar />
        ) : null}
      </div>

      <div>
        <Markdown>{message.content}</Markdown>
      </div>
    </div>
  );
};
