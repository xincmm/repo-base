"use client";

import { Badge } from "@/components/ui/badge";
import { repoTasks } from "@/db/schema/repo-tasks";
import {
  useRealtimeRun,
  UseRealtimeRunInstance,
} from "@trigger.dev/react-hooks";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { AnyTask } from "@trigger.dev/sdk/v3";

interface TaskPillProps {
  task: typeof repoTasks.$inferSelect;
}

const STATUS_GROUPS = {
  success: ["COMPLETED"],
  inProgress: [
    "WAITING_FOR_DEPLOY",
    "QUEUED",
    "EXECUTING",
    "REATTEMPTING",
    "DELAYED",
  ],
  error: [
    "FROZEN",
    "CANCELED",
    "FAILED",
    "CRASHED",
    "INTERRUPTED",
    "SYSTEM_FAILURE",
    "EXPIRED",
    "TIMED_OUT",
  ],
} as const;

const TASK_CONFIG = {
  "get-file-tree": {
    label: "Fetching Files",
    successColor: "bg-green-500",
    inProgressColor: "bg-blue-500",
    errorColor: "bg-red-500",
  },
  "docs-processing-task": {
    label: "Processing Docs",
    successColor: "bg-emerald-500",
    inProgressColor: "bg-indigo-500",
    errorColor: "bg-rose-500",
  },
} as const;

const STATUS_DISPLAY = {
  COMPLETED: "Complete",
  WAITING_FOR_DEPLOY: "Pending",
  QUEUED: "Queued",
  EXECUTING: "Running",
  REATTEMPTING: "Retrying",
  FROZEN: "Frozen",
  CANCELED: "Canceled",
  FAILED: "Failed",
  CRASHED: "Crashed",
  INTERRUPTED: "Stopped",
  SYSTEM_FAILURE: "Error",
  DELAYED: "Delayed",
  EXPIRED: "Expired",
  TIMED_OUT: "Timeout",
} as const;

export const TaskPill: React.FC<TaskPillProps> = ({ task }) => {
  const { run } = useRealtimeRun(task.runId, {
    accessToken: task.taskToken,
  });

  const [statusGroup, setStatusGroup] = useState<keyof typeof STATUS_GROUPS>();

  useEffect(() => {
    const getStatusGroup = (
      status:
        | NonNullable<UseRealtimeRunInstance<AnyTask>["run"]>["status"]
        | undefined,
    ) => {
      if (!status) return "inProgress";
      if (STATUS_GROUPS.success.includes(status as "COMPLETED"))
        return "success";
      if (
        STATUS_GROUPS.inProgress.includes(
          status as
            | "WAITING_FOR_DEPLOY"
            | "QUEUED"
            | "EXECUTING"
            | "REATTEMPTING"
            | "DELAYED",
        )
      )
        return "inProgress";
      if (
        STATUS_GROUPS.error.includes(
          status as
            | "FROZEN"
            | "CANCELED"
            | "FAILED"
            | "CRASHED"
            | "INTERRUPTED"
            | "SYSTEM_FAILURE"
            | "EXPIRED"
            | "TIMED_OUT",
        )
      )
        return "error";
      return "inProgress";
    };

    setStatusGroup(getStatusGroup(run?.status));
  }, [run?.status]);

  const taskConfig = useMemo(
    () =>
      TASK_CONFIG[task.taskId as keyof typeof TASK_CONFIG] ??
      TASK_CONFIG["get-file-tree"],
    [task.taskId],
  );

  const statusText = useMemo(
    () =>
      run?.status
        ? STATUS_DISPLAY[run.status as keyof typeof STATUS_DISPLAY]
        : "Pending",
    [run?.status],
  );

  const dotColor = useMemo(
    () =>
      cn(
        "size-2 rounded-full shrink-0",
        {
          [taskConfig.successColor]: statusGroup === "success",
          [taskConfig.inProgressColor]: statusGroup === "inProgress",
          [taskConfig.errorColor]: statusGroup === "error",
        },
        statusGroup === "inProgress" && "animate-pulse",
      ),
    [
      statusGroup,
      taskConfig.errorColor,
      taskConfig.inProgressColor,
      taskConfig.successColor,
    ],
  );

  return (
    <Badge
      key={task.id}
      className="rounded-full inline-flex items-center gap-2 bg-background py-1 font-normal shadow-inner text-xs"
      variant="outline"
    >
      <div className={dotColor} />
      <span className="truncate">{taskConfig.label}</span>
      <span className="truncate text-[10px] opacity-60">{statusText}</span>
    </Badge>
  );
};
