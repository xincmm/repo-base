"use client";

import { docsProcessingStatusAction } from "@/actions/docs-processing-action";
import { docsProcessingStatus } from "@/db/schema/repos";
import { useRealtimeBatch } from "@trigger.dev/react-hooks";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";

interface ProcessDocumentationProps {
  repoId: number;
  repo: string;
  owner: string;
  runId: string;
  taskToken: string;
  docsProcessingStatus:
    | (typeof docsProcessingStatus.enumValues)[number]
    | null
    | undefined;
}

export const ProcessDocumentation: React.FC<ProcessDocumentationProps> = ({
  runId,
  docsProcessingStatus,
  repo,
  repoId,
  owner,
  taskToken,
}) => {
  const { runs } = useRealtimeBatch(runId, {
    accessToken: taskToken,
  });

  const { execute } = useAction(docsProcessingStatusAction, {
    onSuccess: ({ data }) => console.log({ data }),
  });

  useEffect(() => {
    console.log({ runs });
    if (!docsProcessingStatus && runs.every((r) => r.status === "COMPLETED")) {
      execute({ repo, repoId, owner });
    }
  }, [docsProcessingStatus, execute, owner, repo, repoId, runs]);

  return null;
};
