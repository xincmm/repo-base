"use server";

import { actionClient } from "..";
import { repos } from "@/db/schema/repos";
import { sessionRepos } from "@/db/schema/session-repos";
import { redirect } from "next/navigation";
import { repoLanguages } from "@/db/schema/repo-languages";
import { getFileTreeTask } from "@/trigger/get-file-tree-task";
import { tasks } from "@trigger.dev/sdk/v3";
import { repoTasks } from "@/db/schema/repo-tasks";
import {
  checkIfRepoIsIndexed,
  fetchRepoAndRepoLangs,
  inputSchema,
  transformedSchema,
} from "./utils";

export const initRepoAction = actionClient
  .schema(inputSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { owner, repo, sessionId } = transformedSchema.parse(parsedInput);

    const indexedRepo = await checkIfRepoIsIndexed({ owner, repo, sessionId });

    if (indexedRepo) {
      if (!indexedRepo.sessionRepos.length) {
        await ctx.db.insert(sessionRepos).values({
          sessionId,
          repoId: indexedRepo.id,
        });
      }
      redirect(`/repo/${indexedRepo.id}?sessionId=${sessionId}`);
    }

    const [ghRepo, ghRepoLangs] = await fetchRepoAndRepoLangs({ owner, repo });

    const { repoId, runId, triggerToken } = await ctx.db.transaction(
      async (tx) => {
        const repoName = ghRepo.data.full_name;
        const defaultBranch = ghRepo.data.default_branch;

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

        // insert repository languages
        const langs = Object.entries(ghRepoLangs.data);
        if (langs.length) {
          tx.insert(repoLanguages).values(
            Object.entries(ghRepoLangs.data).map(([language, bytes]) => ({
              language,
              bytes,
              repoId: insertedRepo.repoId,
            })),
          );
        }

        const [, handle] = await Promise.all([
          // insert relation of current session to the repo
          tx.insert(sessionRepos).values({
            repoId: insertedRepo.repoId,
            sessionId: parsedInput.sessionId,
          }),
          // trigger background task to get repository files
          tasks.batchTrigger(getFileTreeTask.id, [
            {
              payload: {
                repoId: insertedRepo.repoId,
                owner,
                repo,
                defaultBranch,
              },
            },
          ]),
        ]);

        await tx
          .insert(repoTasks)
          .values({
            repoId: insertedRepo.repoId,
            taskId: getFileTreeTask.id,
            runId: handle.batchId,
            taskToken: handle.publicAccessToken,
          })
          .returning();

        return {
          repoId: insertedRepo.repoId,
          runId: handle.batchId,
          triggerToken: handle.publicAccessToken,
        };
      },
    );

    redirect(
      `/repo/${repoId}?sessionId=${sessionId}&runId=${runId}&triggerToken=${triggerToken}`,
    );
  });
