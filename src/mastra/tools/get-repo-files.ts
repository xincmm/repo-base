import { db } from "@/db";
import { createTool } from "@mastra/core";
import { z } from "zod";
import { and, eq, sql, count as sqlCount, ilike } from "drizzle-orm";
import { repoFiles, fileType } from "@/db/schema/repo-files";

// Input schema
const inputSchema = z.object({
  repoId: z.number().int().describe("The repository id in the system database"),
  prefix: z
    .string()
    .optional()
    .describe(
      "Optional path prefix to filter files. Only returns files whose paths start with this prefix. For example, 'src/' will return all files under the src directory.",
    ),
  depth: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      "Maximum directory depth to return (0 = root files only, 1 = root + one level deep, etc.). Prefer starting with depth 0 first and increase the depth when you need to see more.",
    )
    .default(0),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe(
      "Maximum number of files to return (1-100). The default is 10. You can query multiple times to get more context, especially if there's more.",
    )
    .default(10),
  offset: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      "Number of files to skip for pagination. If you change the depth argument in subsquent calls, remember that the offset from previous responses might not give you the full picture.",
    )
    .default(0),
});

// Output schema
const outputSchema = z.object({
  files: z
    .array(
      z
        .object({
          path: z
            .string()
            .describe(
              "The file path of the file relative from the root of the repository",
            ),
          content: z
            .string()
            .optional()
            .describe("The content if available in the database"),
          type: z
            .enum(fileType.enumValues)
            .describe("The file type. Either folder or file"),
          depth: z
            .number()
            .int()
            .min(0)
            .describe("How deep the file is from the database."),
        })
        .describe("File object from the database"),
    )
    .describe("List of files from the database"),
  pagination: z
    .object({
      total: z.number().int().min(0).describe("The total number of files"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("The limit that was passed as a parameter"),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("The offset that was passed"),
      hasMore: z
        .boolean()
        .describe(
          "If there are more files based on the limit and offset that was earlier passed",
        ),
    })
    .describe("Pagination context of the query from the database"),
});

export const getRepoFiles = createTool({
  id: "getRepoFiles",
  description:
    "Get repository files with depth-based filtering, pagination, and file type information",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { repoId, prefix, depth, limit, offset } = context;

    // Base conditions
    const conditions = [eq(repoFiles.repoId, repoId)];

    // Add depth condition if specified
    if (typeof depth === "number") {
      conditions.push(
        sql`(length(${repoFiles.path}) - length(replace(${repoFiles.path}, '/', ''))) <= ${depth}`,
      );
    }

    if (prefix) {
      conditions.push(ilike(repoFiles.path, `${prefix}%`));
    }

    // Run both queries concurrently
    const [files, [{ count }]] = await Promise.all([
      db.query.repoFiles.findMany({
        where: and(...conditions),
        limit: limit,
        offset: offset,
        columns: {
          path: true,
          content: true,
          fileType: true,
        },
        orderBy: (f) => f.path,
      }),
      db
        .select({ count: sqlCount() })
        .from(repoFiles)
        .where(and(...conditions)),
    ]);

    return {
      files: files.map((f) => ({
        path: f.path,
        content: f.content || undefined,
        type: f.fileType,
        depth: (f.path.match(/\//g) || []).length,
      })),
      pagination: {
        total: count,
        limit: limit,
        offset: offset,
        hasMore: limit ? offset + limit < count : false,
      },
    };
  },
});
