import { db } from "@/db";
import { gh } from "@/lib/utils";
import { createTool } from "@mastra/core";
import { z } from "zod";

const inputSchema = z.object({
  repoId: z.number().int().describe("The repository id in the system database"),
  sha: z
    .string()
    .optional()
    .describe("SHA or branch to start listing commits from"),
  path: z
    .string()
    .optional()
    .describe("Only return commits containing this file path"),
  author: z
    .string()
    .optional()
    .describe("Filter by commit author (username or email)"),
  since: z
    .string()
    .datetime()
    .optional()
    .describe("Only show commits after this timestamp (ISO 8601)"),
  until: z
    .string()
    .datetime()
    .optional()
    .describe("Only show commits before this timestamp (ISO 8601)"),
  page: z
    .number()
    .int()
    .default(1)
    .describe("The page number of the results to fetch"),
  perPage: z
    .number()
    .int()
    .max(100)
    .default(30)
    .describe("The number of results per page (max 100)"),
});

const outputSchema = z.array(
  z.object({
    sha: z.string().describe("The SHA hash of the commit"),
    message: z.string().describe("The commit message"),
    date: z.string().datetime().nullish().describe("The date of the commit"),
    url: z.string().url().describe("The URL to view the commit"),
    author: z
      .object({
        name: z.string().describe("The name of the author"),
        email: z.string().describe("The email of the author"),
        username: z
          .string()
          .optional()
          .describe("The GitHub username of the author"),
        avatarUrl: z
          .string()
          .url()
          .optional()
          .describe("The URL of the author's avatar"),
        url: z
          .string()
          .url()
          .optional()
          .describe("The URL of the author's profile"),
      })
      .describe("The commit author information"),
    verified: z.boolean().describe("Whether the commit signature is verified"),
  }),
);

export const getRepoCommits = createTool({
  id: "getRepoCommits",
  description: "List commits for a repository with optional filtering",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const {
      repoId,
      sha,
      path,
      author,
      since,
      until,
      page,
      perPage: per_page,
    } = context;

    const repository = await db.query.repos.findFirst({
      where: (f, o) => o.eq(f.id, repoId),
    });

    if (!repository) {
      throw new Error(`Repository with id ${repoId} not found`);
    }

    const [owner, repo] = repository.name.split("/");

    const response = await gh.rest.repos.listCommits({
      owner,
      repo,
      sha,
      path,
      author,
      since,
      until,
      page,
      per_page,
    });

    return response.data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      date: commit.commit.author?.date || commit.commit.committer?.date,
      url: commit.html_url,
      author: {
        name:
          commit.commit.author?.name ||
          commit.commit.committer?.name ||
          "Unknown",
        email:
          commit.commit.author?.email ||
          commit.commit.committer?.email ||
          "unknown",
        username: commit.author?.login || commit.committer?.login,
        avatarUrl: commit.author?.avatar_url || commit.committer?.avatar_url,
        url: commit.author?.html_url || commit.committer?.html_url,
      },
      verified: commit.commit.verification?.verified || false,
    }));
  },
});
