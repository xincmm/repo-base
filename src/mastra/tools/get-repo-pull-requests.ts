import { db } from "@/db";
import { gh } from "@/lib/utils";
import { createTool } from "@mastra/core";
import { z } from "zod";

const inputSchema = z.object({
  repoId: z.number().int().describe("The repository id in the system database"),
  state: z
    .enum(["open", "closed", "all"])
    .default("all")
    .describe("The state of the pull request"),
  page: z
    .number()
    .int()
    .default(1)
    .describe("The page number of the results to fetch."),
  perPage: z
    .number()
    .int()
    .max(100)
    .describe("The number of results per page (max 100)."),
});

const outputSchema = z.array(
  z.object({
    body: z.string().nullable().describe("The body content of the pr"),
    number: z.number().int().describe("The pull request number"),
    state: z.enum(["open", "closed"]).describe("The state of the pull request"),
    title: z.string().describe("The title of the pull request"),
    url: z.string().url().describe("The url to the pull request"),
    user: z
      .object({
        avatarUrl: z.string().url().optional().describe("The url of the user"),
        url: z.string().url().optional().describe("The url to the user"),
        username: z.string().optional().describe("The github user name"),
      })
      .describe("The user details"),
  }),
);

export const getRepoPullRequests = createTool({
  id: "getRepoPullRequests",
  description: "Get pull requests for a repository",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { page, perPage: per_page, state, repoId } = context;

    const repository = await db.query.repos.findFirst({
      where: (f, o) => o.eq(f.id, repoId),
    });

    if (!repository) {
      throw new Error(`Repository with id ${repoId} not found`);
    }

    const response = await gh.rest.pulls.list({
      owner: repository.name.split("/")[0],
      repo: repository.name.split("/")[1],
      state,
      page,
      per_page,
    });

    return response.data.map((r) => ({
      body: r.body,
      number: r.number,
      state: r.state as "open" | "closed",
      title: r.title,
      url: r.html_url,
      user: {
        url: r.user?.html_url,
        avatarUrl: r.user?.avatar_url,
        username: r.user?.login,
      },
    }));
  },
});
