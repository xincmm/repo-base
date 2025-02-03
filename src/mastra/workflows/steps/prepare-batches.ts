import { Step } from "@mastra/core";
import { z } from "zod";

export const fileSchema = z.object({
  id: z.number(),
  path: z.string(),
  repo: z.object({
    name: z.string(),
  }),
});

function prioritizeFiles(
  files: z.infer<typeof fileSchema>[],
): z.infer<typeof fileSchema>[] {
  const docsPattern =
    /readme|contributing|license|conduct|changelog|authors|maintainers|security/i;
  const docsFiles = files.filter((file) => docsPattern.test(file.path));
  const nonDocs = files.filter((file) => !docsPattern.test(file.path));

  // Sort non-documentation files by path depth (shallower first).
  nonDocs.sort((a, b) => a.path.split("/").length - b.path.split("/").length);

  return [...docsFiles, ...nonDocs];
}

function batchFiles(
  files: z.infer<typeof fileSchema>[],
  batchSize = 100,
): z.infer<typeof fileSchema>[][] {
  const batches: z.infer<typeof fileSchema>[][] = [];

  for (let i = 0; i < files.length; i += batchSize) {
    batches.push(files.slice(i, i + batchSize));
  }

  return batches;
}

export const prepareBatchesStep = new Step({
  id: "prepareBatchesStep",
  description: "Prioritize files and split them into batches",
  inputSchema: z.object({
    repoId: z.number(),
    files: z.array(fileSchema),
  }),
  execute: async ({ context }) => {
    const orderedFiles = prioritizeFiles(context.files);
    const batches = batchFiles(orderedFiles, 10);

    return { repoId: context.repoId, batches };
  },
  outputSchema: z.object({
    repoId: z.number(),
    batches: z.array(z.array(fileSchema)),
  }),
});
