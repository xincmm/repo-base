import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  Sidebar,
  SidebarRail,
  SidebarSeparator,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { RepoList, RepoListSkeleton } from "./repo-list";
import Link from "next/link";
import { Suspense } from "react";

interface LeftSidebarInterface {
  repoId?: string;
  sessionId: string;
}

export const LeftSidebar: React.FC<LeftSidebarInterface> = ({
  repoId,
  sessionId,
}) => {
  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarContent>
        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex justify-end">
                <SidebarTrigger />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Your repositories</SidebarGroupLabel>
          <SidebarGroupAction title="New repository">
            <Link href={`/?sessionId=${sessionId}`}>
              <Plus className="size-4" />
              <span className="sr-only">New repository</span>
            </Link>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <Suspense fallback={<RepoListSkeleton />}>
              <RepoList sessionId={sessionId} repoId={repoId} />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
