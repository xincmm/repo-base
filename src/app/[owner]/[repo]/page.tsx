import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { mastra } from "@/mastra";

export default async function Page({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const [resourceId, { owner, repo }] = await Promise.all([
    (await cookies()).get("resourceId")?.value,
    await params,
  ]);

  if (!resourceId) return <div>No cookie</div>; // should not happen

  const resourceThreads = await mastra.memory?.getThreadsByResourceId({
    resourceId,
  });

  const threads = resourceThreads?.filter(
    (thread) =>
      thread.metadata?.owner === owner && thread.metadata?.repo === repo,
  );

  if (!threads || threads.length === 0) {
    const thread = await mastra.memory?.createThread({
      resourceId,
      metadata: { owner, repo },
    });

    if (thread) {
      redirect(`/${owner}/${repo}/${thread?.id}`);
    } else {
      return <div>Thread wasn&apos;t created</div>; // should not happen
    }
  } else {
    return (
      <main className="flex flex-col items-center p-4 md:p-24 w-full"></main>
    );
  }
}
