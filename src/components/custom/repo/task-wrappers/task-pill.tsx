import { Badge } from "@/components/ui/badge";
import type {
  useRealtimeRun,
  UseRealtimeRunInstance,
} from "@trigger.dev/react-hooks";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { getFileTreeTask } from "@/trigger/get-file-tree-task";

type TaskPillProps = {
  task: NonNullable<
    ReturnType<typeof useRealtimeRun<typeof getFileTreeTask>>["run"]
  >;
};

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
  const [statusGroup, setStatusGroup] = useState<keyof typeof STATUS_GROUPS>();

  useEffect(() => {
    const getStatusGroup = (
      status:
        | NonNullable<
            UseRealtimeRunInstance<typeof getFileTreeTask>["run"]
          >["status"]
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

    setStatusGroup(getStatusGroup(task.status));
  }, [task]);

  const taskConfig = useMemo(
    () =>
      TASK_CONFIG[task.taskIdentifier as keyof typeof TASK_CONFIG] ??
      TASK_CONFIG["get-file-tree"],
    [task.taskIdentifier],
  );

  const statusText = useMemo(
    () =>
      statusGroup
        ? STATUS_DISPLAY[task.status as keyof typeof STATUS_DISPLAY]
        : "Pending",
    [statusGroup, task.status],
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
      className="rounded-full inline-flex items-center gap-2 bg-background py-1 font-normal shadow-inner text-xs"
      variant="outline"
    >
      <div className={dotColor} />
      <span className="truncate">{taskConfig.label}</span>
      <span className="truncate text-[10px] opacity-60">{statusText}</span>
    </Badge>
  );
};
