"use server";

import { actionClient } from "..";
import { repos } from "@/db/schema/repos";
import { sessionRepos } from "@/db/schema/session-repos";
import { redirect } from "next/navigation";
import { repoLanguages } from "@/db/schema/repo-languages";
import {
  checkIfRepoIsIndexed,
  fetchFilesFromGithub,
  fetchRepoAndRepoLangs,
  inputSchema,
  transformedSchema,
} from "./utils";
import { repoFiles } from "@/db/schema/repo-files";

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

    const { repoId } = await ctx.db.transaction(async (tx) => {
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

      const [fileInserts] = await Promise.all([
        fetchFilesFromGithub({
          owner: repoName.split("/")[0],
          repo: repoName.split("/")[1],
          repoId: insertedRepo.repoId,
          defaultBranch,
        }),
        tx.insert(sessionRepos).values({
          repoId: insertedRepo.repoId,
          sessionId: parsedInput.sessionId,
        }),
      ]);

      await tx.insert(repoFiles).values(fileInserts);

      return {
        repoId: insertedRepo.repoId,
      };
    });

    redirect(`/repo/${repoId}?sessionId=${sessionId}`);
  });
