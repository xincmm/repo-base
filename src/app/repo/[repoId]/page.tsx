import { LeftSidebar } from "@/components/custom/repo/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

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

      <main>
        <div className="min-h-screen bg-red w-full">Hello there</div>
      </main>
    </SidebarProvider>
  );
}
