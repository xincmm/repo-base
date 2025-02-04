import { db } from "@/db";
import { repoFiles } from "@/db/schema/repo-files";
import { gh } from "@/lib/utils";
import { z } from "zod";

export const inputSchema = z.object({
  repository: z.string(),
  sessionId: z.string().uuid(),
});

export const transformedSchema = inputSchema.transform(
  ({ repository, sessionId }, transformCtx) => {
    const splitInput = repository.split("/");
    if (splitInput.length !== 2) {
      transformCtx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Input should be in the format {owner}/{repo-name} e.g `facebook/react`",
      });
      return z.NEVER;
    }

    return {
      owner: splitInput[0],
      repo: splitInput[1],
      sessionId,
    };
  },
);

export const checkIfRepoIsIndexed = async ({
  owner,
  repo,
  sessionId,
}: {
  owner: string;
  repo: string;
  sessionId: string;
}) => {
  try {
    return await db.query.repos.findFirst({
      where: (f, o) => o.sql`LOWER(${f.name}) = LOWER(${`${owner}/${repo}`})`,
      with: {
        sessionRepos: {
          where: (f, o) => o.eq(f.sessionId, sessionId),
        },
      },
    });
  } catch (error) {
    console.error("checkIfRepoIsIndexed", error);
  }
};

export const fetchRepoAndRepoLangs = async ({
  repo,
  owner,
}: {
  repo: string;
  owner: string;
}) => {
  return Promise.all([
    gh.rest.repos.get({ repo, owner }),
    gh.rest.repos.listLanguages({ repo, owner }),
  ]);
};

export const fetchFilesFromGithub = async ({
  owner,
  repo,
  repoId,
  defaultBranch,
}: {
  owner: string;
  repo: string;
  repoId: number;
  defaultBranch: string;
}) => {
  const tree = await gh.rest.git.getTree({
    owner,
    repo,
    tree_sha: defaultBranch,
    recursive: "true",
  });

  const fileInserts = tree.data.tree.map((file) => ({
    repoId,
    url: file.url,
    path: file.path ?? "",
    sha: file.sha,
    fileType: file.type === "blob" ? ("file" as const) : ("folder" as const),
  }));

  console.dir(fileInserts, { depth: Infinity });

  return fileInserts;
};
