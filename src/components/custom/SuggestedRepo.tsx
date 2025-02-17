"use client";

import { GitBranch as Github, LoaderCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { useAction } from "next-safe-action/hooks";
import { listThreadsOrCreateNewThread } from "@/actions/listThreadsOrCreateNewThread";

export function SuggestedRepo({
  owner,
  repo,
  description,
}: {
  owner: string;
  repo: string;
  description: string;
}) {
  const { execute, isPending } = useAction(listThreadsOrCreateNewThread);

  return (
    <Card
      onClick={() => execute({ owner: owner, repo: repo })}
      className="flex flex-col h-[140px] transition-all hover:border-primary hover:shadow-md rounded-none cursor-pointer"
    >
      <CardHeader className="grow">
        <CardTitle className="flex items-center gap-2 text-base truncate">
          {isPending ? (
            <LoaderCircle className="animate-spin shrink-0 size-4" />
          ) : (
            <Github className="size-4 shrink-0" />
          )}
          <span className="truncate">
            {owner}/{repo}
          </span>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
