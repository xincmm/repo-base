import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { db } from "@/db";
import { GitBranch } from "lucide-react";
import Link from "next/link";

interface RepoListInterface {
  repoId?: number;
  sessionId: string;
}

export const RepoList: React.FC<RepoListInterface> = async ({
  repoId,
  sessionId,
}) => {
  const userSessionRepos = await db.query.sessionRepos.findMany({
    where: (t, h) => h.eq(t.sessionId, sessionId),
    orderBy: (f, o) => o.desc(f.createdAt),
    with: {
      repo: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  return (
    <SidebarMenu>
      {userSessionRepos.map(({ repo }) => (
        <SidebarMenuItem key={repo?.id}>
          <SidebarMenuButton isActive={repo?.id === repoId} asChild>
            <Link href={`/repo/${repo?.id}?sessionId=${sessionId}`}>
              <GitBranch />
              <span className="truncate">{repo?.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export const RepoListSkeleton: React.FC = () => {
  return (
    <SidebarMenu>
      {Array.from({ length: 5 }).map((_, idx) => (
        <SidebarMenuSkeleton key={idx} showIcon />
      ))}
    </SidebarMenu>
  );
};
