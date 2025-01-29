"use server";

import { z } from "zod";
import { actionClient } from ".";

export const docsProcessingStatusAction = actionClient
  .schema(z.object({ repoId: z.number(), repo: z.string(), owner: z.string() }))
  .action(async ({ ctx, parsedInput }) => {
    const docsProcessingWorkflow = ctx.mastra.getWorkflow(
      "documentationProcessingWorkflow",
    );

    const workflowResult = await docsProcessingWorkflow.execute({
      triggerData: parsedInput,
    });

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.dir(workflowResult, { depth: { Infinity } });
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  });
