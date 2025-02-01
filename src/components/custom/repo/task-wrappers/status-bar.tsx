import { db } from "@/db";
import { TaskPill } from "./task-pill";

interface StatusBarProps {
  repoId: number;
}

export const StatusBar: React.FC<StatusBarProps> = async ({ repoId }) => {
  const repositoryTasks = await db.query.repoTasks.findMany({
    where: (f, o) => o.eq(f.repoId, repoId),
  });

  return (
    <div className="flex items-center gap-2 h-8 py-2">
      {repositoryTasks.map((task) => (
        <TaskPill key={task.id} task={task} />
      ))}
    </div>
  );
};
