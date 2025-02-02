import { db } from "@/db";
import { repos } from "@/db/schema/repos";
import { Step } from "@mastra/core";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const fetchRepoFiles = new Step({
  id: "fetchRepoFiles",
  description: "Fetch the files from the repository",
  inputSchema: z.object({
    repoId: z.number().describe("The repository ID where the files belong"),
  }),
  execute: async ({ context }) => {
    await db
      .update(repos)
      .set({ docsProcessingStatus: "triggered" })
      .where(eq(repos.id, context.repoId));

    return {
      repoId: context.repoId,
      files: await db.query.repoFiles.findMany({
        where: (f, o) =>
          o.and(
            o.eq(f.repoId, context.repoId),
            o.isNotNull(f.path),
            o.eq(f.fileType, "file"),
            o.sql`lower(${f.path}) similar to '%readme%|%contributing%|%license%|%conduct%|%changelog%|%authors%|%maintainers%|%security%'`,
          ),
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
      }),
    } as {
      repoId: number;
      files: { id: number; path: string; repo: { name: string } }[];
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
