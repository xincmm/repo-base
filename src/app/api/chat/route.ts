import { mastra } from "@/mastra";
import type { NextRequest } from "next/server";
import type { CoreMessage } from "@mastra/core";
import { cookies } from "next/headers";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const repoId = searchParams.get("repoId");

  const cookieStore = await cookies();
  const cookieThreadId = cookieStore.get(`threadId:${repoId}`);

  const { messages } = (await req.json()) as { messages: CoreMessage[] };

  const chatAgent = mastra.getAgent("repoExplorer");
  const context: CoreMessage[] = [];

  let threadId: string;

  if (!cookieThreadId) {
    const newThreadId = (
      await mastra.memory?.createThread({
        resourceId: String(repoId),
        title: "",
      })
    )?.id;

    if (!newThreadId) throw new Error("Could not create a new thread");

    cookieStore.set(`threadId:${repoId}`, newThreadId);
    threadId = newThreadId;

    const repository = await db.query.repos.findFirst({
      where: (f, o) => o.eq(f.id, Number(repoId)),
      columns: {
        id: true,
        name: true,
        description: true,
      },
    });

    context.push({
      role: "system",
      content: `
  Use this as the repository details: ${JSON.stringify(repository)}.
  Don't mention the repository ID back to the user since it's an internal implementation detail.
  Don't mention the name of the tools to the user.
  `,
    });
  } else {
    threadId = cookieThreadId.value;
  }

  const result = await chatAgent.stream(messages, {
    maxSteps: 20,
    context,
    threadId,
    resourceId: String(repoId),
  });

  return result.toDataStreamResponse();
}
