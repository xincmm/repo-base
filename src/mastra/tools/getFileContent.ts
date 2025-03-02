import { gh } from "@/lib/utils";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

const inputSchema = z.object({
  path: z.string().describe("The file path to fetch content for"),
});

const outputSchema = z.union([
  z
    .object({
      ok: z.literal(true),
      content: z.string().describe("The decoded content of the file"),
    })
    .describe("The success object"),
  z
    .object({
      ok: z.literal(false),
      messsage: z.string().describe("An optional error message of what went wrong"),
    })
    .describe("The error/failed object"),
]);

export const getFileContent = new Tool({
  id: "fetchFileContent",
  description: "Fetch the Mastra documentation file content",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { path } = context;
    console.log("path", path);
    const res = await fetch(`http://localhost:61950/${path}`);
    const content = await res.text();

    return {
      ok: true as const,
      content,
    };
    // try {
    //   const response = await gh.rest.repos.getContent({
    //     owner,
    //     repo,
    //     path,
    //   });

    //   if (Array.isArray(response.data)) {
    //     return {
    //       ok: false as const,
    //       messsage: `Path ${path} points to a directory, not a file`,
    //     };
    //   }

    //   if (!("content" in response.data)) {
    //     return {
    //       ok: false as const,
    //       messsage: `No content available for file ${path}`,
    //     };
    //   }

    //   let content: string;
    //   try {
    //     content = Buffer.from(response.data.content, "base64").toString("utf-8");
    //   } catch (error) {
    //     return {
    //       ok: false as const,
    //       messsage: error instanceof Error ? error.message : "Unkown error",
    //     };
    //   }

    //   return {
    //     ok: true as const,
    //     content,
    //   };
    // } catch (error) {
    //   return {
    //     ok: false as const,
    //     messsage: error instanceof Error ? error.message : "Unkown error",
    //   };
    // }
  },
});
