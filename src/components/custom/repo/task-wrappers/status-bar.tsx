"use client";

import { useFetchingFiles } from "../../providers/fetching-files-task-provider";
import { useEffect, useMemo } from "react";
import { TaskPill } from "./task-pill";
import { docsProcessingStatusAction } from "@/actions/docs-processing-action";
import { useAction } from "next-safe-action/hooks";

interface StatusBarProps {
  owner: string;
  repo: string;
  repoId: number;
  docsProcessingStatus:
    | "not_started"
    | "triggered"
    | "processed"
    | undefined
    | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  docsProcessingStatus,
  owner,
  repo,
  repoId,
}) => {
  const fileTreeBatch = useFetchingFiles();

  const fileTreeTask = useMemo(
    () => fileTreeBatch?.runs.find((r) => r.taskIdentifier === "get-file-tree"),
    [fileTreeBatch?.runs],
  );

  const { execute } = useAction(docsProcessingStatusAction, {
    onSuccess: ({ data }) => console.log({ data }),
  });

  useEffect(() => {
    if (fileTreeTask?.status === "COMPLETED" && !docsProcessingStatus) {
      console.log("executing docs processing action", {
        docsProcessingStatus,
        repo,
        owner,
        repoId,
      });
      execute({ repoId, repo, owner });
    }
  }, [
    docsProcessingStatus,
    execute,
    fileTreeTask?.status,
    owner,
    repo,
    repoId,
  ]);

  return (
    <div className="flex items-center gap-2 h-8 py-2 overflow-auto">
      {fileTreeTask && <TaskPill task={fileTreeTask} />}
    </div>
  );
};
