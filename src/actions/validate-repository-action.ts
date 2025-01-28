"use server";

import { z } from "zod";
import { actionClient } from ".";
import { repos } from "@/db/schema/repos";
import { eq, sql } from "drizzle-orm";
import { sessionRepos } from "@/db/schema/session-repos";
import { redirect } from "next/navigation";
import { repoLanguages } from "@/db/schema/repo-languages";

const inputSchema = z.object({
  repository: z.string(),
  sessionId: z.string().uuid(),
});

const transformedSchema = inputSchema.transform(
  ({ repository }, transformCtx) => {
    const splitInput = repository.split("/");
    if (splitInput.length !== 2) {
      transformCtx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Input should be in the format {owner}/{repo-name} e.g `facebook/react`",
      });
      return z.NEVER;
    }
    return splitInput;
  },
);

export const validateRepositoryAction = actionClient
  .schema(inputSchema)
  .action(async ({ ctx, parsedInput }) => {
    const [owner, repo] = transformedSchema.parse(parsedInput);

    const [ghRepo, ghRepoLangs] = await Promise.all([
      ctx.gh.rest.repos.get({ owner, repo }),
      ctx.gh.rest.repos.listLanguages({
        repo,
        owner,
      }),
    ]);

    const repoName = ghRepo.data.full_name;

    // check if repo is indexed
    const indexedRepo = await ctx.db.query.repos.findFirst({
      where: (t, h) => h.eq(t.name, repoName),
      with: {
        sessionRepos: true,
      },
    });

    let repoId: number;

    if (indexedRepo) {
      repoId = indexedRepo.id;

      await ctx.db.transaction(async (tx) => {
        // increase popularity rank of repo
        await tx
          .update(repos)
          .set({ rank: sql`${repos.rank} + 1` })
          .where(eq(repos.name, repoName));

        // associate repo with current session
        const isSessionRepo = indexedRepo.sessionRepos.some(
          (s) => s.sessionId === parsedInput.sessionId,
        );

        if (!isSessionRepo) {
          await tx.insert(sessionRepos).values({
            sessionId: parsedInput.sessionId,
            repoId: indexedRepo.id,
          });
        }
      });
    } else {
      repoId = await ctx.db.transaction(async (tx) => {
        // save repo details
        const [insertedRepo] = await tx
          .insert(repos)
          .values({
            name: repoName,
            description: ghRepo.data.description,
            language: ghRepo.data.language,
            stars: ghRepo.data.stargazers_count,
            forks: ghRepo.data.forks,
            ownerAvatar: ghRepo.data.owner.avatar_url,
            rank: 1,
          })
          .returning({ repoId: repos.id });

        Promise.all([
          tx.insert(repoLanguages).values(
            Object.entries(ghRepoLangs.data).map(([language, bytes]) => ({
              language,
              bytes,
              repoId: insertedRepo.repoId,
            })),
          ),
          tx.insert(sessionRepos).values({
            repoId: insertedRepo.repoId,
            sessionId: parsedInput.sessionId,
          }),
        ]);

        return insertedRepo.repoId;
      });
    }

    /*TODO:
     * 2. Trigger background processing jobs
     *  - Code understanding job
     *  - Documentation intelligence job
     *  - Development history
     *  - Knowledge Graph job
     */

    if (ghRepo.status === 200) {
      return redirect(`/repo/${repoId}?sessionId=${parsedInput.sessionId}`);
    }

    throw new Error(ghRepo.status);
  });
