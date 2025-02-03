import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { processFileTask } from "./process-file-task";

export const processBatchTask = schemaTask({
  id: "process-batch-task",
  machine: "small-2x",
  schema: z.object({
    repoId: z.number(),
    batch: z.array(
      z.object({
        id: z.number(),
        path: z.string(),
        repo: z.object({
          name: z.string(),
        }),
      }),
    ),
  }),
  run: async (payload) => {
    const { repoId, batch } = payload;

    logger.debug(`started batch ${JSON.stringify(batch, null, 2)}`);

    const res = await processFileTask.batchTrigger(
      batch.map((file) => ({
        payload: { repoId, file },
      })),
    );

    logger.log("done with batch");

    return { ok: true, res };
  },
});
