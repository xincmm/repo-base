import { Workflow } from "@mastra/core";
import { z } from "zod";
import { fetchAllRepoFiles } from "./steps/fetch-all-repo-files";
import { prepareBatchesStep } from "./steps/prepare-batches";
import { triggerBatchProcessingStep } from "./steps/trigger-batch-processing";

export const improvedDocsProcessing = new Workflow({
  name: "improvedDocsProcessing",
  triggerSchema: z.object({ repoId: z.number() }),
})
  .step(fetchAllRepoFiles, {
    variables: { repoId: { step: "trigger", path: "repoId" } },
  })
  .then(prepareBatchesStep, {
    variables: {
      repoId: { step: fetchAllRepoFiles, path: "repoId" },
      files: { step: fetchAllRepoFiles, path: "files" },
    },
  })
  .then(triggerBatchProcessingStep, {
    variables: {
      repoId: { step: prepareBatchesStep, path: "repoId" },
      batches: { step: prepareBatchesStep, path: "batches" },
    },
  })
  .commit();
