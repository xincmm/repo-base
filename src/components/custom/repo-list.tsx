import { db } from "@/db";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";

export const HomeRepoList: React.FC<{ sessionId: string }> = async ({
  sessionId,
}) => {
  const sessionRepos = await db.query.sessionRepos.findMany({
    where: (f, o) => o.and(o.eq(f.sessionId, sessionId), o.isNotNull(f.repoId)),
    columns: { repoId: true },
    with: { repo: true },
    orderBy: (f, o) => o.desc(f.createdAt),
  });

  if (sessionRepos.length) {
    return (
      <div className="space-y-3 w-full max-w-5xl mx-8">
        <h2 className="text-lg font-semibold">Connected repositories</h2>
        <ScrollArea className="h-96 w-full">
          <div className="flex flex-wrap gap-4 w-full">
            {sessionRepos
              .filter((sr) => Boolean(sr.repo))
              .map(
                (sr) =>
                  sr.repo && (
                    <Link
                      key={sr.repoId}
                      href={`/repo/${sr.repoId}`}
                      className="w-full max-w-xs h-36"
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="inline-flex items-center gap-2">
                            {sr.repo.ownerAvatar && (
                              <Image
                                src={sr.repo.ownerAvatar}
                                alt={sr.repo.name}
                                height={24}
                                width={24}
                                className="rounded-full"
                              />
                            )}
                            <span className="truncate">{sr.repo.name}</span>
                          </CardTitle>
                          <CardDescription className="line-clamp-3">
                            {sr.repo.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ),
              )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return null;
};
