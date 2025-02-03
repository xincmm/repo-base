"use server";

import { z } from "zod";
import { actionClient } from ".";

export const docsProcessingStatusAction = actionClient
  .schema(z.object({ repoId: z.number(), repo: z.string(), owner: z.string() }))
  .action(async ({ ctx, parsedInput }) => {
    const existingDocsProcessingTask = await ctx.db.query.repoTasks.findFirst({
      where: (f, o) =>
        o.and(
          o.eq(f.repoId, parsedInput.repoId),
          o.eq(f.taskId, "docs-processing-task"),
        ),
    });

    if (existingDocsProcessingTask) return;
    const improvedDocsProcessingWorkflow = ctx.mastra.getWorkflow(
      "improvedDocsProcessing",
    );

    return await improvedDocsProcessingWorkflow.execute({
      triggerData: { repoId: parsedInput.repoId },
    });
  });
