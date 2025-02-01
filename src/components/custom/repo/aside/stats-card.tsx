import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { db } from "@/db";
import { GitBranch, Star, GitFork, Scale } from "lucide-react";
import Image from "next/image";
import { ProcessDocumentation } from "../task-wrappers/process-documentation";
import { getFileTreeTask } from "@/trigger/get-file-tree-task";

interface StatsCardProps {
  repoId: number;
}

export const StatsCard: React.FC<StatsCardProps> = async ({ repoId }) => {
  const repoStats = await db.query.repos.findFirst({
    where: (t, h) => h.eq(t.id, repoId),
    with: {
      repoLanguages: {
        orderBy: (f, o) => o.desc(f.bytes),
        limit: 10,
      },
    },
    columns: {
      docsProcessingStatus: true,
      name: true,
      stars: true,
      forks: true,
      ownerAvatar: true,
      description: true,
      licenseName: true,
      licenseUrl: true,
    },
    orderBy: (f, o) => o.desc(f.createdAt),
  });

  const fileTreeTask = await db.query.repoTasks.findFirst({
    where: (f, o) =>
      o.and(o.eq(f.taskId, getFileTreeTask.id), o.eq(f.repoId, repoId)),
  });

  return (
    <>
      {fileTreeTask?.runId && fileTreeTask?.taskToken && repoStats?.name && (
        <ProcessDocumentation
          taskToken={fileTreeTask.taskToken}
          runId={fileTreeTask.runId}
          docsProcessingStatus={repoStats?.docsProcessingStatus}
          repoId={Number(repoId)}
          owner={repoStats.name.split("/")[0]}
          repo={repoStats.name.split("/")[1]}
        />
      )}
      <Card className="bg-sidebar shadow-none border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {repoStats?.ownerAvatar ? (
              <Image
                className="rounded-full border"
                src={repoStats?.ownerAvatar}
                alt={repoStats.name}
                width={18}
                height={18}
              />
            ) : (
              <GitBranch className="size-4" />
            )}
            <span className="truncate">{repoStats?.name}</span>
          </CardTitle>
          {repoStats?.description && (
            <CardDescription>{repoStats.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="divide-y">
          <div className="w-full flex items-center flex-wrap gap-2 pb-4">
            <Badge className="rounded-full gap-2">
              <Star className="size-3" />
              <span>{repoStats?.stars}</span>
            </Badge>

            <Badge className="rounded-full gap-2">
              <GitFork className="size-3" />
              <span>{repoStats?.forks}</span>
            </Badge>

            <Badge className="rounded-full gap-2">
              <Scale className="size-3" />
              <span>{repoStats?.licenseName}</span>
            </Badge>
          </div>
          <div className="pt-2">
            <p className="text-sm">Languages</p>
            <div className="flex w-full flex-wrap items-center mt-2 gap-2">
              {repoStats?.repoLanguages.map((lang) => (
                <Badge key={lang.id} className="rounded-full gap-2">
                  {lang.language}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
