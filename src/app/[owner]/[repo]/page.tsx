import {
  ArrowRight,
  GitBranch as Github,
  MessagesSquare,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

import { mastra } from "@/mastra";
import { Button } from "@/components/ui/button";
import { EnsureThread } from "@/components/custom/EnsureThread";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const resourceId = (await cookies()).get("resourceId")!.value;
  const resourceThreads = await mastra.memory?.getThreadsByResourceId({
    resourceId,
  });

  const { owner, repo } = await params;
  const threads = resourceThreads?.filter(
    (thread) =>
      thread.metadata?.owner === owner && thread.metadata?.repo === repo,
  );

  return (
    <EnsureThread
      resourceId={resourceId}
      owner={owner}
      repo={repo}
      threads={threads}
    >
      <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
        <div className="w-full max-w-4xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Chat History
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Github className="h-4 w-4" />
                {owner}/{repo}
              </p>
            </div>
            <Button className="gap-2 rounded-none" asChild>
              <Link href={`/chat/${repo}/new`}>
                <Plus className="h-4 w-4" />
                New chat with repo
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {threads?.map((thread) => (
              <Link
                key={thread.id}
                href={`/chat/${repo}/${thread.id}`}
                className="block"
              >
                <Card className="transition-all hover:border-primary hover:shadow-md rounded-none">
                  <CardHeader className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <MessagesSquare className="h-4 w-4" />
                          {thread.title}
                        </CardTitle>
                      </div>
                      <Button
                        variant="secondary"
                        className="rounded-none h-8 gap-2"
                        size="sm"
                      >
                        Continue chat
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      <time dateTime={thread.createdAt.toLocaleString()}>
                        Created {new Date(thread.createdAt).toLocaleString()}
                      </time>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </EnsureThread>
  );
}
