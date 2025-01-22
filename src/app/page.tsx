import { SearchRepo } from "@/components/custom/search-repo";

export default function Home() {
  return (
    <main>
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 min-h-screen">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-semibold">Repo Base</h1>
          <p className="text-lg text-muted-foreground">
            Turn your favorite repository into a knowledge base and get AI
            powered insights
          </p>
        </header>
        <div className="w-full max-w-xl">
          <SearchRepo />
        </div>
      </div>
    </main>
  );
}
