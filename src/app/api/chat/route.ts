import { mastra } from "@/mastra";
import { NextRequest } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const searchParams = req.nextUrl.searchParams;
  const repoId = searchParams.get("repoId");

  const chatAgent = mastra.getAgent("chatAgent");
  const result = await chatAgent.stream(messages, {
    threadId: repoId ?? undefined,
  });

  return result.toDataStreamResponse();
}
