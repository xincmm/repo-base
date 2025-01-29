interface ChatAreaProps {
  repoId: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ChatArea: React.FC<ChatAreaProps> = ({ repoId }) => {
  return (
    <main className="grow bg-sidebar min-h-screen py-2 space-y-2 flex flex-col">
      <div className="h-7"></div>
      <div className="w-full  bg-background rounded-xl grow shadow-lg border"></div>
    </main>
  );
};
