"use client";

import { useFetchingFiles } from "../../providers/fetching-files-task-provider";
import { useMemo } from "react";
import { TaskPill } from "./task-pill";

export const StatusBar: React.FC = () => {
  const fileTreeBatch = useFetchingFiles();

  const fileTreeTask = useMemo(
    () => fileTreeBatch?.runs.find((r) => r.taskIdentifier === "get-file-tree"),
    [fileTreeBatch?.runs],
  );

  return (
    <div className="flex items-center gap-2 h-8 py-2 overflow-auto">
      {fileTreeTask && <TaskPill task={fileTreeTask} />}
    </div>
  );
};
