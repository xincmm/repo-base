import { db } from "@/db";
import { FetchingFilesTaskProvider } from "./fetching-files-task-provider";

interface FetchingFilesProviderWrapperProps {
  repoId: number;
}

export const FetchingFilesProviderWrapper: React.FC<
  React.PropsWithChildren<FetchingFilesProviderWrapperProps>
> = async ({ children, repoId }) => {
  const fileTreeTask = await db.query.repoTasks.findFirst({
    where: (f, o) =>
      o.and(o.eq(f.repoId, repoId), o.eq(f.taskId, "get-file-tree")),
  });

  return (
    <FetchingFilesTaskProvider
      batchId={fileTreeTask.runId}
      accessToken={fileTreeTask.taskToken}
    >
      {children}
    </FetchingFilesTaskProvider>
  );
};
