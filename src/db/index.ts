import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { sessions, sessionsRelations } from "./schema/sessions";
import { repos, reposRelations } from "./schema/repos";
import { sessionRepos, sessionReposRelations } from "./schema/session-repos";
import { repoLanguages, repoLanguagesRelations } from "./schema/repo-languages";
import { repoFiles, repoFilesRelations } from "./schema/repo-files";
import { repoTasks, repoTasksRelations } from "./schema/repo-tasks";

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  schema: {
    sessions,
    sessionsRelations,
    repos,
    reposRelations,
    sessionRepos,
    sessionReposRelations,
    repoLanguages,
    repoLanguagesRelations,
    repoFiles,
    repoFilesRelations,
    repoTasks,
    repoTasksRelations,
  },
});
