import { Workflow } from "@mastra/core";
import { fetchRepoFiles } from "./steps/fetch-repo-files";
import { z } from "zod";
import { fetchFileContent } from "./steps/fetch-file-contents";

export const improvedDocsProcessing = new Workflow({
  name: "improvedDocsProcessing",
  triggerSchema: z.object({ repoId: z.number() }),
})
  .step(fetchRepoFiles, {
    variables: { repoId: { step: "trigger", path: "repoId" } },
  })
  .then(fetchFileContent, {
    variables: {
      repoId: { step: fetchRepoFiles, path: "repoId" },
      files: { step: fetchRepoFiles, path: "files" },
    },
  })
  .commit();
