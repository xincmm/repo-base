import { cookies } from "next/headers";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "../ui/sidebar";
import { mastra } from "@/mastra";
import Link from "next/link";

export const AppSidebar = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) => {
  const resourceId = (await cookies()).get("resourceId")?.value;

  if (resourceId) {
    const grouped = Object.groupBy(
      (await mastra.memory?.getThreadsByResourceId({
        resourceId,
      })) ?? [],
      ({ metadata }) =>
        metadata?.owner === owner && metadata?.repo === repo ? "repo" : "other",
    );

    return (
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">Repo Base</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Chats with {owner}/{repo}
            </SidebarGroupLabel>
            <SidebarMenu>
              {grouped["repo"]?.map((t) => (
                <SidebarMenuItem key={t.id}>
                  <SidebarMenuButton className="truncate" asChild>
                    <Link href={`/${owner}/${repo}/${t.id}`}>
                      <span>{t.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Other chats</SidebarGroupLabel>
            <SidebarMenu>
              {grouped["other"]?.map((t) => (
                <SidebarMenuItem key={t.id}>
                  <SidebarMenuButton className="truncate" asChild>
                    <Link
                      href={`/${t.metadata?.owner}/${t.metadata?.repo}/${t.id}`}
                    >
                      <span>{t.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuSkeleton />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
