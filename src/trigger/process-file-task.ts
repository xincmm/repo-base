import { logger, schemaTask, wait } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { embedMany, MDocument } from "@mastra/rag";
import { pgVector } from "@/mastra";
import { fetchFileContent, updateFileContent } from "@/lib/server-utils";
import { EmbedManyResult } from "@mastra/core";

export const processFileTask = schemaTask({
  id: "process-file-task",
  machine: "small-2x",
  queue: {
    concurrencyLimit: 5,
    name: "file-processing-queue",
  },
  schema: z.object({
    repoId: z.number(),
    file: z.object({
      id: z.number(),
      path: z.string(),
      repo: z.object({
        name: z.string(),
      }),
    }),
  }),
  run: async (payload) => {
    const { repoId, file } = payload;

    logger.debug(JSON.stringify(file, null, 2));

    const content = await fetchFileContent({
      path: file.path,
      owner: file.repo.name.split("/")[0],
      repo: file.repo.name.split("/")[1],
    });

    logger.debug("fetched content");

    if (content) {
      await updateFileContent({ fileId: file.id, content });

      logger.debug("updated content");

      const doc = MDocument.fromText(content, {
        path: file.path,
        id: file.id,
      });

      logger.debug("created MDocument");

      const chunks = await doc.chunk({
        strategy: "recursive",
        size: 512,
        overlap: 50,
      });

      logger.debug("generated chunks");

      const embeddings: EmbedManyResult<string>["embeddings"] = [];

      if (chunks.length > 20) {
        const batchSize = 20;

        for (let i = 0; i < chunks.length; i += batchSize) {
          const currentBatch = chunks.slice(i, i + batchSize);

          const embedManyResult = await embedMany(currentBatch, {
            apiKey: process.env.COHERE_API_KEY!,
            model: "embed-english-v3.0",
            provider: "COHERE",
            maxRetries: 3,
          });

          embeddings.push(...embedManyResult.embeddings);

          await wait.for({ seconds: 15 }); // free-tier cohere limits
        }
      } else {
        const embedManyResult = await embedMany(chunks, {
          apiKey: process.env.COHERE_API_KEY!,
          model: "embed-english-v3.0",
          provider: "COHERE",
          maxRetries: 3,
        });

        embeddings.push(...embedManyResult.embeddings);
      }

      logger.debug("generated embeddings");

      const metadata = chunks.map((chunk, idx) => ({
        fileId: file.id,
        filePath: file.path,
        chunkIndex: idx,
        text: chunk.text,
      }));

      const indexes = await pgVector.listIndexes();

      if (!indexes.includes(`embeddings_${repoId}`)) {
        await pgVector.createIndex(`embeddings_${repoId}`, 1024);
      }

      await pgVector.upsert(`embeddings_${repoId}`, embeddings, metadata);

      logger.debug("upserted embeddings");
    }

    logger.debug("done with file");

    return { ok: true };
  },
});
