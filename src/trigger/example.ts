import { logger, schemaTask, task, wait } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const helloWorldTask = task({
  id: "hello-world",
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload: object, { ctx }) => {
    logger.log("Hello, world!", { payload, ctx });

    await wait.for({ seconds: 5 });

    return {
      message: "Hello, world!",
    };
  },
});

export const getFileTreeTask = schemaTask({
  id: "get-file-tree",
  schema: z.object({
    repoId: z.number(),
    repo: z.string(),
    owner: z.string(),
    defaultBranch: z.string(),
  }),
  run: async (payload) => {},
});
