"use server";

import { z } from "zod";
import { actionClient } from ".";
import { tasks } from "@trigger.dev/sdk/v3";
import { docsProcessingTask } from "@/trigger/docs-processing-task";
import { repoTasks } from "@/db/schema/repo-tasks";

export const docsProcessingStatusAction = actionClient
  .schema(z.object({ repoId: z.number(), repo: z.string(), owner: z.string() }))
  .action(async ({ ctx, parsedInput }) => {
    const triggerResponse = await tasks.trigger(docsProcessingTask.id, {
      ...parsedInput,
    });

    await ctx.db.insert(repoTasks).values({
      repoId: parsedInput.repoId,
      taskId: docsProcessingTask.id,
      runId: triggerResponse.id,
      taskToken: triggerResponse.publicAccessToken,
    });

    return triggerResponse;
  });
