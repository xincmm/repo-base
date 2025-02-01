import { ChatAreaWrapper } from "@/components/custom/repo/chat/chat-area-wrapper";
import { TriggerProvider } from "@/components/custom/providers/trigger-provider";
import { FileExplorer } from "@/components/custom/repo/aside/file-explorer";
import { StatsCard } from "@/components/custom/repo/aside/stats-card";
import { LeftSidebar } from "@/components/custom/repo/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StatusBar } from "@/components/custom/repo/task-wrappers/status-bar";

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
  const { runId, sessionId, triggerToken } = await searchParams;
  const { repoId } = await params;

  return (
    <TriggerProvider accessToken={triggerToken}>
      <SidebarProvider>
        <LeftSidebar sessionId={sessionId} repoId={repoId} />
        <div className="flex h-screen w-full">
          <div className="py-2 bg-sidebar grow space-y-2">
            <StatusBar repoId={Number(repoId)} />
            <ChatAreaWrapper repoId={Number(repoId)} />
          </div>
          <aside className="w-full max-w-sm p-2 bg-sidebar h-screen flex flex-col gap-2 shrink-0">
            <header className="text-lg font-semibold">Repository info</header>
            <hr />
            <StatsCard repoId={Number(repoId)} />
            <hr />
            <FileExplorer runId={runId} repoId={Number(repoId)} />
          </aside>
        </div>
      </SidebarProvider>
    </TriggerProvider>
  );
}
