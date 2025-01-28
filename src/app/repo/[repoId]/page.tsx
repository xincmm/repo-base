import { TriggerProvider } from "@/components/custom/providers/trigger-provider";
import { FileExplorer } from "@/components/custom/repo/aside/file-explorer";
import { StatsCard } from "@/components/custom/repo/aside/stats-card";
import { LeftSidebar } from "@/components/custom/repo/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

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
          <main className="grow">
            <div className="min-h-screen bg-red w-full">Hello there</div>
          </main>

          <aside className="border-l w-full max-w-lg p-2 bg-secondary h-screen flex flex-col gap-2">
            <header className="text-lg font-semibold">Repository info</header>
            <StatsCard repoId={Number(repoId)} />
            <FileExplorer runId={runId} repoId={Number(repoId)} />
          </aside>
        </div>
      </SidebarProvider>
    </TriggerProvider>
  );
}
