import { mastra } from "@/mastra";
import { Assistant } from "@/app/assistant";

export default async function Page({
  params,
}: {
  params: Promise<{ owner: string; repo: string; threadId: string }>;
}) {
  const { threadId } = await params;
  const queryResponse = await mastra.memory?.query({ threadId });

  const initialMessages = (queryResponse?.uiMessages ?? []).map((m) => ({
    ...m,
    content:
      m.content === "" && !!m.toolInvocations?.length
        ? m.toolInvocations?.map((tool) => ({ ...tool, type: "tool-call" }))
        : m.content,
  }));

  //@ts-expect-error type mismatch
  return <Assistant initialMessages={initialMessages} />;
}
