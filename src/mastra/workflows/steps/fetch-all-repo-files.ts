import { db } from "@/db";
import { repos } from "@/db/schema/repos";
import { Step } from "@mastra/core";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const fetchAllRepoFiles = new Step({
  id: "fetchAllRepoFiles",
  description: "Fetch all the files from the repository",
  inputSchema: z.object({
    repoId: z.number().describe("The repository ID where the files belong"),
  }),
  execute: async ({ context }) => {
    await db
      .update(repos)
      .set({ docsProcessingStatus: "triggered" })
      .where(eq(repos.id, context.repoId));

    const files = await db.query.repoFiles.findMany({
      where: (f, o) =>
        o.and(o.eq(f.repoId, context.repoId), o.eq(f.fileType, "file")), // ensure we just pick files and no folders
      columns: {
        id: true,
        path: true,
      },
      with: {
        repo: {
          columns: {
            name: true,
          },
        },
      },
    });

    return {
      repoId: context.repoId,
      files,
    };
  },
  outputSchema: z.object({
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
});
