import { Message } from "ai";
import { MastraAvatar, UserAvatar } from "./avatars";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";
import { CheckCircle, LoaderCircle } from "lucide-react";

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

      <div className="flex flex-col gap-3 grow">
        <Markdown>{message.content}</Markdown>

        <div>
          {message.toolInvocations?.map((toolInvocation) => (
            <div key={toolInvocation.toolCallId}>
              {toolInvocation.toolName === "queryDocumentation" && (
                <div className="flex gap-3 items-center text-xs text-muted-foreground px-2 py-1 bg-muted border rounded-lg w-full shadow-md mb-2">
                  {toolInvocation.state === "call" && (
                    <>
                      <LoaderCircle className="animate-spin size-4" />
                      <span>Querying documentation</span>
                    </>
                  )}

                  {toolInvocation.state === "result" && (
                    <>
                      <CheckCircle className="text-green-600 size-4" />
                      <span>Documentation queried</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
