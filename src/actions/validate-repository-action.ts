"use server";

import { z } from "zod";
import { actionClient } from ".";

const inputSchema = z.object({
  repository: z.string(),
});

const transformedSchema = inputSchema.transform(
  ({ repository }, transformCtx) => {
    const splitInput = repository.split("/");
    if (splitInput.length !== 2) {
      transformCtx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Input should be in the format {owner}/{repo-name} e.g `facebook/react`",
      });
      return z.NEVER;
    }
    return splitInput;
  },
);

export const validateRepositoryAction = actionClient
  .schema(inputSchema)
  .action(async ({ ctx, parsedInput }) => {
    const [owner, repo] = transformedSchema.parse(parsedInput);
    const res = await ctx.gh.rest.repos.get({ owner, repo });

    /*TODO:
     * 1. Save validated repository details from gh
     *  - owner's avatar, repo's full name, description, language, stars and forks
     *  - unique session_id
     *  - if repo exists in storage, increase repo request frequency
     *    - This will help us keep track of popular repos and show them on home screen
     * 2. Trigger background processing jobs
     *  - Code understanding job
     *  - Documentation intelligence job
     *  - Development history
     *  - Knowledge Graph job
     */

    return res;
  });
