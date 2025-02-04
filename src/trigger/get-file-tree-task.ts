import { db } from "@/db";
import { repoFiles } from "@/db/schema/repo-files";
import { gh } from "@/lib/utils";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const getFileTreeTask = schemaTask({
  id: "get-file-tree",
  schema: z.object({
    repoId: z.number(),
    repo: z.string(),
    owner: z.string(),
    defaultBranch: z.string(),
  }),
  run: async (p) => {
    try {
      const tree = await gh.rest.git.getTree({
        owner: p.owner,
        repo: p.repo,
        tree_sha: p.defaultBranch,
        recursive: "true",
      });

      const fileInserts = tree.data.tree.map((file) => ({
        repoId: p.repoId,
        url: file.url,
        path: file.path ?? "",
        sha: file.sha,
        fileType:
          file.type === "blob" ? ("file" as const) : ("folder" as const),
      }));

      await db.insert(repoFiles).values(fileInserts);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  },
});
