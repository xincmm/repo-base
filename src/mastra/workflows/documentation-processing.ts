import { db } from "@/db";
import { Step, Workflow } from "@mastra/core";
import { z } from "zod";
import { gh } from "@/lib/utils";
import { RepoFile } from "@/db/schema/repo-files";
import { repos } from "@/db/schema/repos";
import { eq } from "drizzle-orm";
import { embedMany, MDocument } from "@mastra/rag";

const fetchDocumentationFiles = new Step({
  id: "fetchDocumentationFiles",
  description:
    "Fetch documentation related files from the repository. This does a simple pattern search to get files like READMEs, LICENSE, CONTRIBUTING, etc and does deduplication and some pre-processing",
  inputSchema: z.object({
    repoId: z.number(),
    repo: z.string(),
    owner: z.string(),
  }),
  outputSchema: z.object({
    repoId: z.number(),
    files: z.array(
      z.object({
        path: z.string().nullable(),
        repoId: z.number().int().nullable(),
        id: z.number().int(),
        fileType: z.enum(["file", "folder"]).nullable(),
        sha: z.string().nullable(),
        url: z.string().url().nullable(),
        depth: z.number(),
      }),
    ),
  }),
  execute: async ({ context: c }) => {
    const [files] = await Promise.all([
      await db.query.repoFiles.findMany({
        where: (f, o) =>
          o.and(
            o.eq(f.repoId, c.repoId),
            o.eq(f.fileType, "file"),
            o.sql`lower(${f.path}) similar to '%readme%|%contributing%|%license%|%conduct%|%changelog%|%authors%|%maintainers%|%security%'`,
          ),
      }),
      await db
        .update(repos)
        .set({ docsProcessingStatus: "triggered" })
        .where(eq(repos.id, c.repoId)),
    ]);

    const seenHashes = new Set<string>();

    // NOTE: this doesn't add path context while deduplicating. It might be useful
    const deduplicatedFiles = files
      .filter((f) => !!f.path)
      .map((file) => ({
        ...file,
        depth: (file.path?.match(/\//g) || []).length,
      }))
      .sort((a, b) => a.depth - b.depth) // prioritize shallower paths
      .filter((f) => {
        if (!f.sha || seenHashes.has(f.sha)) return false;
        seenHashes.add(f.sha);
        return true;
      }); // deduplicate files that might exist, like multiple licenses

    // Handles fetches to the gh api in batches and accounts for rate limits
    const fetchAndMergeFilesContents = async (
      files: typeof deduplicatedFiles,
    ): Promise<(RepoFile & { depth: number; content: string })[]> => {
      const batchSize = 10;
      const mergedFilesContents: (RepoFile & {
        depth: number;
        content: string;
      })[] = [];

      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);

        const batchPromises = batch.map(async (file) => {
          try {
            const response = await gh.rest.repos.getContent({
              owner: c.owner,
              repo: c.repo,
              path: file.path!,
            });

            if (Array.isArray(response.data)) {
              return null;
            }

            if (response.data.type === "file") {
              const content = Buffer.from(
                response.data.content,
                "base64",
              ).toString("utf-8");

              return {
                ...file,
                content,
              };
            }
          } catch {
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        const successfulResults = batchResults.filter(
          Boolean,
        ) as typeof mergedFilesContents;
        mergedFilesContents.push(...successfulResults);

        // Ratelimits
        if (i + batchSize < files.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return mergedFilesContents;
    };

    return {
      repoId: c.repoId,
      files: await fetchAndMergeFilesContents(deduplicatedFiles),
    };
  },
});

const chunkAndEmbed = new Step({
  id: "chunkAndEmbed",
  description: "Chunk, store and create embeddings from documents",
  inputSchema: z.object({
    repoId: z.number(),
    files: z.array(
      z.object({
        path: z.string().nullable(),
        repoId: z.number().int().nullable(),
        id: z.number().int(),
        fileType: z.enum(["file", "folder"]).nullable(),
        sha: z.string().nullable(),
        url: z.string().url().nullable(),
        depth: z.number(),
        content: z.string(),
      }),
    ),
  }),
  execute: async ({ context: c, mastra: m }) => {
    const pgVector = m?.vectors?.pgVector;

    if (!pgVector) throw new Error("pgVector not available");

    const { files, repoId } = c;
    const batchSize = 10;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allMetadata: Record<string, any>[] = [];
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (file) => {
          const doc = MDocument.fromText(file.content, {
            path: file.path,
            url: file.url,
          });

          const chunks = await doc.chunk({
            strategy: "recursive",
            size: 512,
            overlap: 50,
            separator: "\n",
            extract: {
              title: true,
              summary: true,
            },
          });

          const metadata = chunks.map((c) => c.metadata);
          allMetadata.push(...metadata);

          const embeddings = await embedMany(chunks, {
            model: "text-embedding-3-small",
            provider: "OPEN_AI",
            maxRetries: 3,
          });
          allEmbeddings.push(...embeddings.embeddings);
        }),
      );

      if (allEmbeddings.length > 0) {
        const indexes = await pgVector.listIndexes();

        if (!indexes.includes(`embeddings_${repoId}`)) {
          await pgVector.createIndex(`embeddings_${repoId}`, 1536);
        }
        // TODO: Should I also save the actual text chunks?
        await pgVector.upsert(
          `embeddings_${repoId}`,
          allEmbeddings,
          allMetadata,
        );
        allEmbeddings.length = 0;
        allMetadata.length = 0;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  },
});

export const documentationProcessingWorkflow = new Workflow({
  name: "documentationProcessingWorkflow",
  triggerSchema: z.object({
    repoId: z.number(),
    repo: z.string(),
    owner: z.string(),
  }),
})
  .step(fetchDocumentationFiles, {
    variables: {
      repoId: { step: "trigger", path: "repoId" },
      repo: { step: "trigger", path: "repo" },
      owner: { step: "trigger", path: "owner" },
    },
  })
  .then(chunkAndEmbed, {
    variables: {
      files: { step: fetchDocumentationFiles, path: "files" },
      repoId: { step: fetchDocumentationFiles, path: "repoId" },
    },
  })
  .commit(); // must commit at the end of the workflow
