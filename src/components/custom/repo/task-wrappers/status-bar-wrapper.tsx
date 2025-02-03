import { db } from "@/db";
import { StatusBar } from "./status-bar";
import { notFound } from "next/navigation";

interface StatusBarWrapperProps {
  repoId: number;
}

export const StatusBarWrapper: React.FC<StatusBarWrapperProps> = async ({
  repoId,
}) => {
  const repo = await db.query.repos.findFirst({
    where: (f, o) => o.eq(f.id, repoId),
    columns: {
      name: true,
      docsProcessingStatus: true,
    },
  });

  if (!repo) notFound();

  return (
    <StatusBar
      docsProcessingStatus={repo.docsProcessingStatus}
      repoId={repoId}
      owner={repo.name.split("/")[0]}
      repo={repo.name.split("/")[1]}
    />
  );
};
