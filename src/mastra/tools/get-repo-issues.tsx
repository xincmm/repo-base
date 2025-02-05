import { db } from "@/db";
import { gh } from "@/lib/utils";
import { createTool } from "@mastra/core";
import { z } from "zod";

const inputSchema = z.object({
  repoId: z.number().int().describe("The repository id in the system database"),
  state: z
    .enum(["open", "closed", "all"])
    .default("all")
    .describe("The state of the issue"),
  labels: z
    .array(z.string())
    .optional()
    .describe("List of label names to filter issues by"),
  assignee: z
    .string()
    .optional()
    .describe("GitHub username of the assignee to filter issues by"),
  creator: z
    .string()
    .optional()
    .describe("GitHub username of the issue creator to filter by"),
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
    body: z.string().nullish().describe("The body content of the issue"),
    number: z.number().int().describe("The issue number"),
    state: z.enum(["open", "closed"]).describe("The state of the issue"),
    title: z.string().describe("The title of the issue"),
    url: z.string().url().describe("The url to the issue"),
    labels: z
      .array(
        z.object({
          name: z.string().describe("The name of the label"),
          color: z.string().describe("The color of the label"),
        }),
      )
      .describe("The labels attached to the issue"),
    assignees: z
      .array(
        z.object({
          avatarUrl: z
            .string()
            .url()
            .optional()
            .describe("The url of the assignee's avatar"),
          url: z
            .string()
            .url()
            .optional()
            .describe("The url to the assignee's profile"),
          username: z
            .string()
            .optional()
            .describe("The github username of the assignee"),
        }),
      )
      .describe("The users assigned to the issue"),
    user: z
      .object({
        avatarUrl: z
          .string()
          .url()
          .optional()
          .describe("The url of the user's avatar"),
        url: z
          .string()
          .url()
          .optional()
          .describe("The url to the user's profile"),
        username: z.string().optional().describe("The github username"),
      })
      .describe("The user details of the issue creator"),
    createdAt: z.string().describe("The creation date of the issue"),
    updatedAt: z.string().describe("The last update date of the issue"),
    closedAt: z
      .string()
      .nullable()
      .describe("The closing date of the issue if closed"),
  }),
);

export const getRepoIssues = createTool({
  id: "getRepoIssues",
  description: "Get issues (excluding pull requests) for a repository",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const {
      page,
      perPage: per_page,
      state,
      repoId,
      labels,
      assignee,
      creator,
    } = context;

    // Fetch repository details
    const repository = await db.query.repos.findFirst({
      where: (f, o) => o.eq(f.id, repoId),
    });

    if (!repository) {
      throw new Error(`Repository with id ${repoId} not found`);
    }

    const [owner, repo] = repository.name.split("/");

    // Fetch issues using GitHub REST API
    const response = await gh.rest.issues.listForRepo({
      owner,
      repo,
      state,
      labels: labels?.join(","),
      assignee,
      creator,
      page,
      per_page,
    });

    // Filter out pull requests and map the response to match our schema
    return response.data
      .filter((issue) => !issue.pull_request) // Exclude pull requests
      .map((issue) => ({
        body: issue.body,
        number: issue.number,
        state: issue.state as "open" | "closed",
        title: issue.title,
        url: issue.html_url,
        labels: issue.labels.map((label) => ({
          name: typeof label === "object" ? label.name || "" : "",
          color: typeof label === "object" ? label.color || "" : "",
        })),
        assignees:
          issue.assignees?.map((assignee) => ({
            url: assignee.html_url,
            avatarUrl: assignee.avatar_url,
            username: assignee.login,
          })) || [],
        user: {
          url: issue.user?.html_url,
          avatarUrl: issue.user?.avatar_url,
          username: issue.user?.login,
        },
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        closedAt: issue.closed_at,
      }));
  },
});
