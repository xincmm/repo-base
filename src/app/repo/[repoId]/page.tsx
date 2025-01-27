import { db } from "@/db";

export default async function RepoPage({
  params,
}: {
  params: Promise<{ repoId: string }>;
}) {
  const repoId = (await params).repoId;
  const repo = await db.query.repos.findFirst({
    where: (t, h) => h.eq(t.id, Number(repoId)),
  });

  return <div>{JSON.stringify(repo, null, 2)}</div>;
}
