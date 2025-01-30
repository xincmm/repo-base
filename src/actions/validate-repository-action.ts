"use server";

import { z } from "zod";
import { actionClient } from ".";
import { repos } from "@/db/schema/repos";
import { eq, sql } from "drizzle-orm";
import { sessionRepos } from "@/db/schema/session-repos";
import { redirect } from "next/navigation";
import { repoLanguages } from "@/db/schema/repo-languages";
import { getFileTreeTask } from "@/trigger/example";
import { tasks } from "@trigger.dev/sdk/v3";
import { repoTasks } from "@/db/schema/repo-tasks";

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

    // ghRepo.data.master_branch

    const repoName = ghRepo.data.full_name;
    const defaultBranch = ghRepo.data.default_branch;

    // check if repo is indexed
    const indexedRepo = await ctx.db.query.repos.findFirst({
      where: (t, h) => h.eq(t.name, repoName),
      with: {
        sessionRepos: true,
      },
    });

    const utilStore: Record<string, number | string> = {};

    if (indexedRepo) {
      utilStore.repoId = indexedRepo.id;

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

      return redirect(
        `/repo/${utilStore.repoId}?sessionId=${parsedInput.sessionId}`,
      );
    } else {
      await ctx.db.transaction(async (tx) => {
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
            licenseName: ghRepo.data.license?.name,
            licenseUrl: ghRepo.data.license?.html_url,
            rank: 1,
          })
          .returning({ repoId: repos.id });

        const [, , handle] = await Promise.all([
          // insert repository languages
          tx.insert(repoLanguages).values(
            Object.entries(ghRepoLangs.data).map(([language, bytes]) => ({
              language,
              bytes,
              repoId: insertedRepo.repoId,
            })),
          ),

          // insert relation of current session to the repo
          tx.insert(sessionRepos).values({
            repoId: insertedRepo.repoId,
            sessionId: parsedInput.sessionId,
          }),

          // trigger background task to get repository files
          tasks.trigger(getFileTreeTask.id, {
            repoId: insertedRepo.repoId,
            owner,
            repo,
            defaultBranch,
          }),
        ]);

        await tx
          .insert(repoTasks)
          .values({
            repoId: insertedRepo.repoId,
            taskId: getFileTreeTask.id,
            runId: handle.id,
            taskToken: handle.publicAccessToken,
          })
          .returning();

        utilStore.repoId = insertedRepo.repoId;
        utilStore.runId = handle.id;
        utilStore.triggerToken = handle.publicAccessToken;
      });

      return redirect(
        `/repo/${utilStore.repoId}?sessionId=${parsedInput.sessionId}&runId=${utilStore.runId}&triggerToken=${utilStore.triggerToken}`,
      );
    }
  });

/*TODO:
 * 2. Trigger background processing jobs
 *  - Code understanding job
 *  - Documentation intelligence job
 *  - Development history
 *  - Knowledge Graph job
 */
