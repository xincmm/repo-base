import { mastra } from "@/mastra";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const docsProcessingTask = schemaTask({
  id: "docs-processing-task",
  machine: {
    preset: "small-2x",
  },
  schema: z.object({
    repoId: z.number(),
    repo: z.string(),
    owner: z.string(),
  }),
  run: async (p) => {
    const docsProcessingWorkflow = mastra.getWorkflow(
      "documentationProcessingWorkflow",
    );

    return await docsProcessingWorkflow.execute({
      triggerData: p,
    });
  },
});
