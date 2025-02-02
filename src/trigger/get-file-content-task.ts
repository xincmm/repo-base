import { db } from "@/db";
import { repoFiles } from "@/db/schema/repo-files";
import { gh } from "@/lib/utils";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const getFileContent = schemaTask({
  id: "get-file-content",
  queue: { concurrencyLimit: 5 },
  schema: z.object({
    id: z.number(),
    repo: z.string(),
    owner: z.string(),
    path: z.string(),
  }),
  run: async ({ owner, id, repo, path }) => {
    try {
      const response = await gh.rest.repos.getContent({
        path,
        owner,
        repo,
      });
      if (!Array.isArray(response.data) && response.data.type === "file") {
        try {
          await db
            .update(repoFiles)
            .set({
              content: Buffer.from(response.data.content, "base64").toString(
                "utf-8",
              ),
            })
            .where(eq(repoFiles.id, id));
          return {
            ok: true,
            message: "File content saved in the database",
          } as const;
        } catch (error) {
          if (error instanceof Error) {
            return {
              ok: false,
              message: "Failed to save file to db",
              error,
            } as const;
          } else {
            return {
              ok: false,
              message: "Failed to save file to db",
              error: new Error("Failed to save file to db"),
            } as const;
          }
        }
      }

      return {
        ok: false,
        message: "File response from GitHub was not a file",
        error: new Error("File response from GitHub was not a file"),
      } as const;
    } catch (error) {
      if (error instanceof Error) {
        return {
          ok: false,
          message: "GitHub API error",
          error,
        } as const;
      } else {
        return {
          ok: false,
          message: "GitHub API error",
          error: new Error("GitHub API error"),
        } as const;
      }
    }
  },
});
