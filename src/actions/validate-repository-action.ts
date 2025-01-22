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
        message: "Repository input should be in the format {owner}/{repo-name}",
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
    return res;
  });
