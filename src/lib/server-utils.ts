import { db } from "@/db";
import { repoFiles } from "@/db/schema/repo-files";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { gh } from "./utils";

export const fetchFileContentSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  path: z.string(),
});

export const fetchFileContent = async ({
  owner,
  repo,
  path,
}: z.infer<typeof fetchFileContentSchema>) => {
  const response = await gh.rest.repos.getContent({
    path,
    owner,
    repo,
  });

  if (!Array.isArray(response.data) && response.data.type === "file") {
    return Buffer.from(response.data.content, "base64").toString("utf-8");
  }
};

export const updateFileContentSchema = z.object({
  fileId: z.number(),
  content: z.string(),
});

export const updateFileContent = async ({
  fileId,
  content,
}: z.infer<typeof updateFileContentSchema>) => {
  await db.update(repoFiles).set({ content }).where(eq(repoFiles.id, fileId));
};
