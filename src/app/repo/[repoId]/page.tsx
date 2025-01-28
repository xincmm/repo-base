import { StatsCard } from "@/components/custom/repo/aside/stats-card";
import { LeftSidebar } from "@/components/custom/repo/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Activity, FolderTree, Search } from "lucide-react";

export default async function RepoPage({
  params,
  searchParams,
}: {
  params: Promise<{ repoId: string }>;
  searchParams: Promise<{ repoId?: string; sessionId: string }>;
}) {
  const { sessionId } = await searchParams;
  const { repoId } = await params;

  return (
    <SidebarProvider>
      <LeftSidebar sessionId={sessionId} repoId={repoId} />

      <div className="flex min-h-screen w-full">
        <main className="grow">
          <div className="min-h-screen bg-red w-full">Hello there</div>
        </main>

        <aside className="border-l w-full max-w-lg p-4 space-y-3 bg-secondary">
          <header className="text-lg font-semibold">Repository info</header>

          <StatsCard repoId={Number(repoId)} />

          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-4" />
                <span>Processing status</span>
                <span className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="size-4" />
                File explorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input className="pl-9" />
                <Search className="size-5 absolute -top-0.5 left-2 translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
              <div></div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </SidebarProvider>
  );
}
