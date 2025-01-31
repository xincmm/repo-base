import { mastra } from "@/mastra";
import type { NextRequest } from "next/server";
import type { CoreMessage } from "@mastra/core";
import { cookies } from "next/headers";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!mastra?.memory) throw new Error("Mastra memory not available");

  const searchParams = req.nextUrl.searchParams;
  const repoId = searchParams.get("repoId");

  const cookieStore = await cookies();
  const cookieThreadId = cookieStore.get(`threadId:${repoId}`);

  const { messages } = (await req.json()) as { messages: CoreMessage[] };

  const chatAgent = mastra.getAgent("chatAgent");

  let threadId: string;

  if (!cookieThreadId) {
    const newThreadId = (
      await mastra.memory.createThread({ resourceid: String(repoId) })
    ).id;

    if (!newThreadId) throw new Error("Could not create a new thread");

    cookieStore.set(`threadId:${repoId}`, newThreadId);
    threadId = newThreadId;
  } else {
    threadId = cookieThreadId.value;
  }

  const firstSystemMessage: CoreMessage = {
    role: "user",
    content: `Use this as the \`repoId\` parameter: ${repoId}`,
  };

  const finalMessages =
    messages.length > 1 ? messages : [firstSystemMessage, ...messages];

  const result = await chatAgent.stream(finalMessages, {
    threadId,
    resourceid: String(repoId),
  });

  return result.toDataStreamResponse();
}
