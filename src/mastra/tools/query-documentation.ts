import { createTool } from "@mastra/core";
import { z } from "zod";
import { embed } from "@mastra/rag";

export const queryDocumentation = createTool({
  id: "queryDocumentation",
  description:
    "Query repository documentation by passing in the repository's id and the query string",
  inputSchema: z.object({
    repoId: z
      .number()
      .describe(
        "This will be a number provided by the system. The id is the id in the database",
      ),
    query: z.string(),
  }),
  execute: async ({ context: c, mastra }) => {
    const { repoId, query } = c;
    const vector = mastra?.vectors?.pgVector;

    if (!vector) throw new Error("pgVector instance wasn't found");

    const queryVector = await embed(query, {
      model: "text-embedding-3-small",
      provider: "OPEN_AI",
      maxRetries: 3,
    });

    const queryResult = await vector.query(
      `embeddings_${repoId}`,
      queryVector.embedding,
    );

    return queryResult.map((r) => r.metadata);
  },
});
