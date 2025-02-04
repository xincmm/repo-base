import { Message } from "ai";
import { MastraAvatar, UserAvatar } from "./avatars";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";
import { CheckCircle, LoaderCircle } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageViewerProps {
  message: Message;
}

export const MessageViewer: React.FC<MessageViewerProps> = ({ message }) => {
  return (
    <div
      className={cn(
        "rounded-lg p-2 flex gap-2 text-sm w-[calc(var(--limit-width)+8px)]",
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

        {message.toolInvocations?.map((toolInvocation) => (
          <div key={toolInvocation.toolCallId} className="space-y-2">
            <div className="flex gap-3 items-center text-xs text-muted-foreground px-2 py-1 bg-muted border rounded-lg shadow-md mb-2 w-[calc(var(--limit-width)-32px)]">
              {toolInvocation.state === "call" && (
                <>
                  <LoaderCircle className="animate-spin size-4" />
                  <span>{toolInvocation.toolName.toLocaleUpperCase()}</span>
                </>
              )}

              {toolInvocation.state === "result" && (
                <>
                  <CheckCircle className="text-green-600 size-4" />
                  <span>{toolInvocation.toolName.toLocaleUpperCase()}</span>
                </>
              )}
            </div>

            {/* {toolInvocation.args && ( */}
            {/*   <ScrollArea className="bg-background p-2 rounded-lg border shadow-md w-[calc(var(--limit-width)-32px)]"> */}
            {/*     <code>{JSON.stringify(toolInvocation.args, null, 2)}</code> */}
            {/*   </ScrollArea> */}
            {/* )} */}
            {/**/}
            {/* {toolInvocation.state === "result" && ( */}
            {/*   <ScrollArea className="h-40 bg-background p-2 rounded-lg border shadow-md w-[calc(var(--limit-width)-32px)]"> */}
            {/*     <pre className=""> */}
            {/*       <code>{JSON.stringify(toolInvocation.result, null, 2)}</code> */}
            {/*     </pre> */}
            {/*   </ScrollArea> */}
            {/* )} */}
          </div>
        ))}
      </div>
    </div>
  );
};
