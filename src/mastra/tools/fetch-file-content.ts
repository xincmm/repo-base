import { db } from "@/db";
import { createTool } from "@mastra/core";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { repoFiles } from "@/db/schema/repo-files";
import { repos } from "@/db/schema/repos";
import { gh } from "@/lib/utils";

const inputSchema = z.object({
  repoId: z.number().int().describe("The repository id in the system database"),
  path: z.string().describe("The file path to fetch content for"),
});

const outputSchema = z.object({
  content: z.string().describe("The decoded content of the file"),
  sha: z.string().describe("The SHA hash of the file content"),
  size: z.number().describe("The size of the file in bytes"),
  encoding: z
    .string()
    .describe("The encoding used for the file content from GitHub"),
});

export const fetchFileContent = createTool({
  id: "fetchFileContent",
  description:
    "Fetch file content from GitHub, decode it, and update the database",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { repoId, path } = context;

    // First, get repository information from database
    const repository = await db.query.repos.findFirst({
      where: eq(repos.id, repoId),
    });

    if (!repository) {
      throw new Error(`Repository with id ${repoId} not found`);
    }

    // Get the file from GitHub
    const response = await gh.rest.repos.getContent({
      owner: repository.name.split("/")[0],
      repo: repository.name.split("/")[1],
      path: path,
    });

    // GitHub returns an array for directories, we want a single file
    if (Array.isArray(response.data)) {
      throw new Error(`Path ${path} points to a directory, not a file`);
    }

    // Ensure we have the content field
    if (!("content" in response.data)) {
      throw new Error(`No content available for file ${path}`);
    }

    // Decode content (GitHub returns base64 encoded content)
    const decodedContent = Buffer.from(
      response.data.content,
      "base64",
    ).toString("utf-8");

    // Update the database with the new content
    await db
      .update(repoFiles)
      .set({
        content: decodedContent,
        sha: response.data.sha,
        updateAt: new Date(),
      })
      .where(and(eq(repoFiles.repoId, repoId), eq(repoFiles.path, path)));

    return {
      content: decodedContent,
      sha: response.data.sha,
      size: response.data.size,
      encoding: response.data.encoding,
    };
  },
});
