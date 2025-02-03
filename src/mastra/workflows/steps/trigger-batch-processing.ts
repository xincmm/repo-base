import { Step } from "@mastra/core";
import { z } from "zod";
import { processBatchTask } from "@/trigger/process-batch-task";
import { db } from "@/db";
import { fileSchema } from "./prepare-batches";
import { batchHandles as batchHandlesTable } from "@/db/schema/batch-handles";

export const triggerBatchProcessingStep = new Step({
  id: "triggerBatchProcessingStep",
  description: "Trigger Trigger.dev batch tasks to process each batch of files",
  inputSchema: z.object({
    repoId: z.number(),
    batches: z.array(z.array(fileSchema)),
  }),
  execute: async ({ context }) => {
    const { repoId, batches } = context;
    const batchHandles = [];

    for (const [i, batch] of batches.entries()) {
      const idempotencyKey = `repo-${repoId}-batch-${i}`;

      const handle = await processBatchTask.batchTrigger(
        [
          {
            payload: { repoId, batch },
            options: {
              delay: i === 0 ? undefined : new Date(Date.now() + 1000 * i * 60),
            },
          },
        ],
        {
          idempotencyKey,
        },
      );

      // Persist batch handle metadata in the database for tracking.
      await db.insert(batchHandlesTable).values({
        repoId,
        batchIndex: i,
        batchId: handle.batchId,
        accessToken: handle.publicAccessToken,
        status: "triggered",
      });

      batchHandles.push({
        batchId: handle.batchId,
        accessToken: handle.publicAccessToken,
      });
    }

    return { repoId, batchHandles };
  },
  outputSchema: z.object({
    repoId: z.number(),
    batchHandles: z.array(
      z.object({
        batchId: z.string(),
        accessToken: z.string(),
      }),
    ),
  }),
});
