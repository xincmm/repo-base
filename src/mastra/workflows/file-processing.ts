import { db } from "@/db";
import { repoFiles } from "@/db/schema/repo-files";
import { gh } from "@/lib/utils";
import { Step, Workflow } from "@mastra/core";
import { z } from "zod";

export const fileProcessingWorkflow = new Workflow({
  name: "fileProcessingWorkflow",
  triggerSchema: z.object({
    repoId: z.number().int(),
    repo: z.string(),
    owner: z.string(),
    defaultBranch: z.string(),
  }),
})
  .step(
    new Step({
      id: "getTree",
      inputSchema: z.object({
        defaultBranch: z.string(),
        owner: z.string(),
        repo: z.string(),
        repoId: z.number(),
      }),
      execute: async ({ context: c }) => {
        const tree = await gh.rest.git.getTree({
          owner: c.owner,
          repo: c.repo,
          tree_sha: c.defaultBranch,
          recursive: "true",
        });

        const fileInserts = tree.data.tree.map((file) => ({
          repoId: c.repoId,
          url: file.url,
          path: file.path,
          sha: file.sha,
          fileType:
            file.type === "blob"
              ? ("file" as const)
              : file.type === "tree"
                ? ("folder" as const)
                : null,
        }));

        await db.insert(repoFiles).values(fileInserts);
      },
    }),
    {
      variables: {
        defaultBranch: { path: "defaultBranch", step: "trigger" },
        owner: { path: "owner", step: "trigger" },
        repo: { path: "repo", step: "trigger" },
        repoId: { path: "repoId", step: "trigger" },
      },
    },
  )
  .commit();
