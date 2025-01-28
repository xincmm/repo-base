import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { db } from "@/db";
import { GitBranch, Star, GitFork, Scale } from "lucide-react";
import Image from "next/image";

interface StatsCardProps {
  repoId: number;
}

export const StatsCard: React.FC<StatsCardProps> = async ({ repoId }) => {
  const repoStats = await db.query.repos.findFirst({
    where: (t, h) => h.eq(t.id, repoId),
    with: {
      repoLanguages: {
        orderBy: (f, o) => o.desc(f.bytes),
      },
    },
    columns: {
      name: true,
      stars: true,
      forks: true,
      ownerAvatar: true,
      description: true,
    },
    orderBy: (f, o) => o.desc(f.createdAt),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {repoStats?.ownerAvatar ? (
            <Image
              className="rounded-full border"
              src={repoStats?.ownerAvatar}
              alt={repoStats.name}
              width={18}
              height={18}
            />
          ) : (
            <GitBranch className="size-4" />
          )}
          <span>{repoStats?.name}</span>
        </CardTitle>
        {repoStats?.description && (
          <CardDescription>{repoStats.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="divide-y">
        <div className="w-full flex items-center flex-wrap gap-3 pb-4">
          <Badge className="rounded-full gap-2">
            <Star className="size-3" />
            <span>{repoStats?.stars}</span>
          </Badge>

          <Badge className="rounded-full gap-2">
            <GitFork className="size-3" />
            <span>{repoStats?.forks}</span>
          </Badge>

          <Badge className="rounded-full gap-2">
            <Scale className="size-3" />
            <span>MIT</span>
          </Badge>
        </div>
        <div className="pt-2">
          <p className="text-sm">Languages</p>
          <div className="flex w-full flex-wrap items-center mt-2 gap-3">
            {repoStats?.repoLanguages.map((lang) => (
              <Badge key={lang.id} className="rounded-full gap-2">
                {lang.language}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
