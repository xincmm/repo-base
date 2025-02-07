import { ChatAreaWrapper } from "@/components/custom/repo/chat/chat-area-wrapper";
import { FileExplorer } from "@/components/custom/repo/aside/file-explorer";
import { StatsCard } from "@/components/custom/repo/aside/stats-card";
import { LeftSidebar } from "@/components/custom/repo/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Container } from "./container";
import { MainContainer } from "./aside-container";

export default async function RepoPage({
  params,
  searchParams,
}: {
  params: Promise<{ repoId: string }>;
  searchParams: Promise<{
    sessionId: string;
    triggerToken?: string;
    runId?: string;
  }>;
}) {
  const { runId, sessionId } = await searchParams;
  const { repoId: stringRepoId } = await params;
  const repoId = Number(stringRepoId);

  return (
    <SidebarProvider>
      <LeftSidebar sessionId={sessionId} repoId={repoId} />
      <Container>
        <MainContainer>
          <ChatAreaWrapper repoId={repoId} />
        </MainContainer>

        <aside className="p-2 bg-sidebar h-screen flex flex-col gap-2 w-full max-w-sm">
          <header className="text-lg font-semibold">Repository info</header>
          <hr />
          <StatsCard repoId={repoId} />
          <hr />
          <FileExplorer runId={runId} repoId={repoId} />
        </aside>
      </Container>
    </SidebarProvider>
  );
}
