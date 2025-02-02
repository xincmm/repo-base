import { db } from "@/db";
import { repoTasks } from "@/db/schema/repo-tasks";
import { getFileContent } from "@/trigger/get-file-content-task";
import { Step } from "@mastra/core";
import { tasks } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const fetchFileContent = new Step({
  id: "fetchFileContent",
  description: "Fetch contents of the files",
  inputSchema: z.object({
    repoId: z.number(),
    files: z.array(
      z.object({
        id: z.number(),
        path: z.string(),
        repo: z.object({
          name: z.string(),
        }),
      }),
    ),
  }),
  execute: async ({ context, mastra }) => {
    try {
      const handle = await tasks.batchTrigger<typeof getFileContent>(
        getFileContent.id,
        context.files.map((f) => ({
          payload: {
            id: f.id,
            repo: f.repo.name.split("/")[1],
            owner: f.repo.name.split("/")[0],
            path: f.path,
          },
        })),
      );

      return await db
        .insert(repoTasks)
        .values({
          runId: handle.batchId,
          taskToken: handle.publicAccessToken,
          repoId: context.repoId,
          taskId: getFileContent.id,
        })
        .returning();
    } catch (error) {
      mastra?.logger?.error(JSON.stringify(error, null, 2));
      throw error;
    }
  },
});
