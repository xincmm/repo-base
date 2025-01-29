"use client";

import { docsProcessingStatusAction } from "@/actions/docs-processing-action";
import { docsProcessingStatus } from "@/db/schema/repos";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";

interface ProcessDocumentationProps {
  docsProcessingStatus: (typeof docsProcessingStatus.enumValues)[number];
  repoId: number;
  repo: string;
  owner: string;
}

export const ProcessDocumentation: React.FC<ProcessDocumentationProps> = ({
  docsProcessingStatus,
  repo,
  repoId,
  owner,
}) => {
  const { execute } = useAction(docsProcessingStatusAction);

  useEffect(() => {
    if (docsProcessingStatus === "not_started") {
      execute({ repo, repoId, owner });
    }
  }, [docsProcessingStatus, execute, owner, repo, repoId]);

  return null;
};
