import { mastra } from "@/mastra";
import { NextRequest } from "next/server";
import { CoreMessage } from "@mastra/core";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as { messages: CoreMessage[] };

  const searchParams = req.nextUrl.searchParams;
  const repoId = searchParams.get("repoId");

  const chatAgent = mastra.getAgent("chatAgent");

  const firstSystemMessage: CoreMessage = {
    role: "user",
    content: `Use this as the \`repoId\` parameter: ${repoId}`,
  };

  const finalMessages =
    messages.length > 1 ? messages : [firstSystemMessage, ...messages];

  const result = await chatAgent.stream(finalMessages);

  return result.toDataStreamResponse();
}
